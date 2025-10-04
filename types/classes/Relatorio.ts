import { PrismaClient } from '@prisma/client';

export class Relatorio {
  private readonly prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  private toNumber(value: any): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return value;
    const n = Number(value);
    return Number.isNaN(n) ? 0 : n;
  }

  // ===== General totals =====
  async getTotalVendas(): Promise<number> {
    const res = await this.prisma.$queryRaw<
      Array<{ total: number | string }>
    >`SELECT COALESCE(SUM("total"),0)::double precision AS "total" FROM "nota_fiscal_venda"`;
    return this.toNumber(res[0]?.total);
  }

  async getTotalGastos(): Promise<number> {
    const res = await this.prisma.$queryRaw<
      Array<{ total: number | string }>
    >`SELECT COALESCE(SUM("total"),0)::double precision AS "total" FROM "nota_fiscal_compra"`;
    return this.toNumber(res[0]?.total);
  }

  async getProdutosEmEstoque(): Promise<number> {
    const res = await this.prisma.$queryRaw<
      Array<{ total: number | string }>
    >`SELECT COALESCE(SUM("quantidade"),0) AS "total" FROM "produto_estoque" p where p.id <> 1`;
    return this.toNumber(res[0]?.total);
  }

  async getTotalNotas(): Promise<number> {
    const res = await this.prisma.$queryRaw<
      Array<{ total: number | string }>
    >`SELECT (COALESCE((SELECT COUNT(*) FROM "nota_fiscal_compra"),0) + COALESCE((SELECT COUNT(*) FROM "nota_fiscal_venda"),0)) AS "total"`;
    return this.toNumber(res[0]?.total);
  }

  // ===== Sales Reports =====
  async getVendasPorPeriodo(
    periodo: 'daily' | 'weekly' | 'monthly' | 'annual',
  ): Promise<{ data: Date; total: number; count: number }[]> {
    const now = new Date();
    let startDate: Date;
    let trunc: string;

    switch (periodo) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        trunc = 'day';
        break;
      case 'weekly':
        // start of current week (Sunday)
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        startDate = startOfWeek;
        trunc = 'week';
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        trunc = 'month';
        break;
      case 'annual':
        startDate = new Date(now.getFullYear(), 0, 1);
        trunc = 'year';
        break;
      default:
        throw new Error('Período inválido');
    }

    const rows = await this.prisma.$queryRaw<
      Array<{ data: Date; total: number | string; count: number | string }>
    >`SELECT date_trunc(${trunc}, "data") AS "data", COALESCE(SUM("total"),0)::double precision AS "total", COUNT("id")::int AS "count"
      FROM "nota_fiscal_venda"
      WHERE "data" >= ${startDate}
      GROUP BY 1
      ORDER BY 1`;

    return rows.map((r) => ({
      data: new Date(r.data),
      total: this.toNumber(r.total),
      count: Number(r.count ?? 0),
    }));
  }

  async getComparativoPeriodos(
    startDate1: Date,
    endDate1: Date,
    startDate2: Date,
    endDate2: Date,
  ): Promise<{
    periodo1: { total: number; count: number };
    periodo2: { total: number; count: number };
  }> {
    const p1 = await this.prisma.$queryRaw<
      Array<{ total: number | string; count: number | string }>
    >`SELECT COALESCE(SUM("total"),0)::double precision AS "total", COUNT("id")::int AS "count"
        FROM "nota_fiscal_venda" WHERE "data" >= ${startDate1} AND "data" < ${endDate1}`;

    const p2 = await this.prisma.$queryRaw<
      Array<{ total: number | string; count: number | string }>
    >`SELECT COALESCE(SUM("total"),0)::double precision AS "total", COUNT("id")::int AS "count"
        FROM "nota_fiscal_venda" WHERE "data" >= ${startDate2} AND "data" < ${endDate2}`;

    return {
      periodo1: { total: this.toNumber(p1[0]?.total), count: Number(p1[0]?.count ?? 0) },
      periodo2: { total: this.toNumber(p2[0]?.total), count: Number(p2[0]?.count ?? 0) },
    };
  }

  async getProdutosMaisVendidos(
    limit: number = 10,
    by: 'quantidade' | 'faturamento' = 'faturamento',
  ): Promise<
    { produtoId: number; nome: string; totalQuantidade: number; totalFaturamento: number }[]
  > {
    // Validação do parâmetro 'by' para evitar injeção
    if (by !== 'quantidade' && by !== 'faturamento') by = 'faturamento';

    if (by === 'quantidade') {
      const rows = await this.prisma.$queryRaw<
        Array<{
          produtoId: number;
          nome: string;
          totalQuantidade: number | string;
          totalFaturamento: number | string;
        }>
      >`SELECT pv."produtoId" AS "produtoId", p.nome AS nome, SUM(pv.quantidade)::int AS "totalQuantidade", COALESCE(SUM(pv."precoUnitario"*pv.quantidade),0)::double precision AS "totalFaturamento"
        FROM "produto_venda" pv
        JOIN "produto" p ON p.id = pv."produtoId"
        GROUP BY pv."produtoId", p.nome
        ORDER BY SUM(pv.quantidade) DESC
        LIMIT ${limit}`;
      return rows.map((r) => ({
        produtoId: Number(r.produtoId),
        nome: r.nome,
        totalQuantidade: Number(r.totalQuantidade ?? 0),
        totalFaturamento: this.toNumber(r.totalFaturamento),
      }));
    } else {
      const rows = await this.prisma.$queryRaw<
        Array<{
          produtoId: number;
          nome: string;
          totalQuantidade: number | string;
          totalFaturamento: number | string;
        }>
      >`SELECT pv."produtoId" AS "produtoId", p.nome AS nome, SUM(pv.quantidade)::int AS "totalQuantidade", COALESCE(SUM(pv."precoUnitario"*pv.quantidade),0)::double precision AS "totalFaturamento"
        FROM "produto_venda" pv
        JOIN "produto" p ON p.id = pv."produtoId"
        GROUP BY pv."produtoId", p.nome
        ORDER BY COALESCE(SUM(pv."precoUnitario"*pv.quantidade),0) DESC
        LIMIT ${limit}`;
      return rows.map((r) => ({
        produtoId: Number(r.produtoId),
        nome: r.nome,
        totalQuantidade: Number(r.totalQuantidade ?? 0),
        totalFaturamento: this.toNumber(r.totalFaturamento),
      }));
    }
  }

  async getVendasPorCategoria(): Promise<
    { categoriaId: number; nome: string; totalVendas: number; totalQuantidade: number }[]
  > {
    const rows = await this.prisma.$queryRaw<
      Array<{
        categoriaId: number;
        nome: string;
        totalVendas: number | string;
        totalQuantidade: number | string;
      }>
    >`SELECT c.id AS "categoriaId", c.name AS nome,
        COALESCE(SUM(pv."precoUnitario"*pv.quantidade),0)::double precision AS "totalVendas",
        COALESCE(SUM(pv.quantidade),0)::int AS "totalQuantidade"
      FROM "produto_venda" pv
      JOIN "produto" p ON p.id = pv."produtoId"
      JOIN "categoria" c ON c.id = p."categoriaId"
      WHERE c.id IS NOT NULL
      GROUP BY c.id, c.name
      ORDER BY "totalVendas" DESC`;
    return rows.map((r) => ({
      categoriaId: Number(r.categoriaId),
      nome: r.nome,
      totalVendas: this.toNumber(r.totalVendas),
      totalQuantidade: Number(r.totalQuantidade ?? 0),
    }));
  }

  async getMargemLucroPorProduto(
    limit: number = 10,
  ): Promise<{ produtoId: number; nome: string; margem: number }[]> {
    const rows = await this.prisma.$queryRaw<
      Array<{
        produtoId: number;
        nome: string;
        revenue: number | string;
        cost: number | string;
        margem: number | string;
      }>
    >`SELECT p.id AS "produtoId", p.nome AS nome,
        COALESCE(rev.total_revenue,0)::double precision AS revenue,
        COALESCE(cost.total_cost,0)::double precision AS cost,
        CASE WHEN COALESCE(rev.total_revenue,0) > 0 THEN ((COALESCE(rev.total_revenue,0) - COALESCE(cost.total_cost,0))/COALESCE(rev.total_revenue,0))*100 ELSE 0 END AS margem
      FROM "produto" p
      LEFT JOIN (
        SELECT pv."produtoId", SUM(pv."precoUnitario"*pv.quantidade) AS total_revenue
        FROM "produto_venda" pv
        GROUP BY pv."produtoId"
      ) rev ON rev."produtoId" = p.id
      LEFT JOIN (
        SELECT pc."produtoId", SUM(pc."precoUnitario"*pc.quantidade) AS total_cost
        FROM "produto_compra" pc
        GROUP BY pc."produtoId"
      ) cost ON cost."produtoId" = p.id
      where p.id <> 1
      ORDER BY margem DESC
      LIMIT ${limit}`;

    return rows.map((r) => ({
      produtoId: Number(r.produtoId),
      nome: r.nome,
      margem: this.toNumber(r.margem),
    }));
  }

  // ===== Stock Reports =====
  async getPosicaoEstoqueAtual(): Promise<
    { produtoId: number; nome: string; quantidade: number; preco: number; valorTotal: number }[]
  > {
    const rows = await this.prisma.$queryRaw<
      Array<{
        produtoId: number;
        nome: string;
        quantidade: number | string;
        preco: number | string;
        valorTotal: number | string;
      }>
    >`SELECT pe."produtoId" AS "produtoId", p.nome AS nome, COALESCE(SUM(pe.quantidade),0)::int AS quantidade, COALESCE(AVG(pe.preco),0)::double precision AS preco,
        (COALESCE(SUM(pe.quantidade),0) * COALESCE(AVG(pe.preco),0))::double precision AS "valorTotal"
      FROM "produto_estoque" pe
      JOIN "produto" p ON p.id = pe."produtoId"
      WHERE pe.id <> 1
      GROUP BY pe."produtoId", p.nome`;

    return rows.map((r) => ({
      produtoId: Number(r.produtoId),
      nome: r.nome,
      quantidade: Number(r.quantidade ?? 0),
      preco: this.toNumber(r.preco),
      valorTotal: this.toNumber(r.valorTotal),
    }));
  }

  async getCurvaABCEstoque(): Promise<
    { produtoId: number; nome: string; valorEstoque: number; categoria: 'A' | 'B' | 'C' }[]
  > {
    const rows = await this.prisma.$queryRaw<
      Array<{ produtoId: number; nome: string; valorEstoque: number | string }>
    >`SELECT p.id AS "produtoId", p.nome AS nome, COALESCE(SUM(pe.quantidade * pe.preco),0)::double precision AS "valorEstoque"
      FROM "produto_estoque" pe
      JOIN "produto" p ON p.id = pe."produtoId"
      GROUP BY p.id, p.nome
      ORDER BY "valorEstoque" DESC`;

    const results = rows.map((r) => ({
      produtoId: Number(r.produtoId),
      nome: r.nome,
      valorEstoque: this.toNumber(r.valorEstoque),
    }));

    const totalValue = results.reduce((s, r) => s + r.valorEstoque, 0) || 1; // evitar div/0
    let cumulative = 0;
    const mapped = results.map((r) => {
      cumulative += (r.valorEstoque / totalValue) * 100;
      let categoria: 'A' | 'B' | 'C' = 'C';
      if (cumulative <= 80) categoria = 'A';
      else if (cumulative <= 95) categoria = 'B';
      else categoria = 'C';
      return { produtoId: r.produtoId, nome: r.nome, valorEstoque: r.valorEstoque, categoria };
    });

    return mapped;
  }

  async getGiroEstoque(
    periodo: 'monthly' | 'annual' = 'monthly',
  ): Promise<{ produtoId: number; nome: string; giro: number }[]> {
    const now = new Date();
    let startDate: Date;
    if (periodo === 'monthly') {
      // mês anterior (do primeiro dia)
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    } else {
      startDate = new Date(now.getFullYear(), 0, 1);
    }
    const endDate = now;

    const rows = await this.prisma.$queryRaw<
      Array<{
        produtoId: number;
        nome: string;
        custoVendido: number | string;
        estoqueMedio: number | string;
      }>
    >`SELECT p.id AS "produtoId", p.nome AS nome,
        COALESCE(c.total_custo,0)::double precision AS "custoVendido",
        COALESCE(AVG(pe.quantidade),0)::double precision AS "estoqueMedio"
      FROM "produto" p
      LEFT JOIN (
        SELECT pc."produtoId", SUM(pc."precoUnitario"*pc.quantidade) AS total_custo
        FROM "produto_compra" pc
        JOIN "nota_fiscal_compra" nf ON pc."notaFiscalId" = nf.id
        WHERE nf."data" >= ${startDate} AND nf."data" < ${endDate}
        GROUP BY pc."produtoId"
      ) c ON c."produtoId" = p.id
      LEFT JOIN "produto_estoque" pe ON pe."produtoId" = p.id
      GROUP BY p.id, p.nome, c.total_custo
      ORDER BY (CASE WHEN AVG(pe.quantidade) IS NOT NULL AND AVG(pe.quantidade) > 0 THEN (c.total_custo / AVG(pe.quantidade)) ELSE 0 END) DESC`;

    const results = rows.map((r) => {
      const custoVendido = this.toNumber(r.custoVendido);
      const estoqueMedio = this.toNumber(r.estoqueMedio);
      const giro = estoqueMedio > 0 ? custoVendido / estoqueMedio : 0;
      return {
        produtoId: Number(r.produtoId),
        nome: r.nome,
        giro,
      };
    });

    results.sort((a, b) => b.giro - a.giro);
    return results;
  }

  async getProdutosBaixoEstoque(
    minLevel: number = 10,
  ): Promise<{ produtoId: number; nome: string; quantidadeAtual: number }[]> {
    const rows = await this.prisma.$queryRaw<
      Array<{ produtoId: number; nome: string; quantidadeAtual: number | string }>
    >`SELECT p.id AS "produtoId", p.nome AS nome, COALESCE(SUM(pe.quantidade),0)::int AS "quantidadeAtual"
      FROM "produto" p
      LEFT JOIN "produto_estoque" pe ON pe."produtoId" = p.id
      WHERE p."ativo" = true and pe.id <> 1
      GROUP BY p.id, p.nome
      HAVING COALESCE(SUM(pe.quantidade),0) <= ${minLevel}
      ORDER BY "quantidadeAtual" ASC`;

    return rows.map((r) => ({
      produtoId: Number(r.produtoId),
      nome: r.nome,
      quantidadeAtual: Number(r.quantidadeAtual ?? 0),
    }));
  }

  async getProdutosSemGiro(
    days: number = 90,
  ): Promise<{ produtoId: number; nome: string; diasSemVenda: number }[]> {
    // cutoffDate: consider products with last_sale < cutoff OR no sale at all
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const rows = await this.prisma.$queryRaw<
      Array<{ produtoId: number; nome: string; diasSemVenda: number | string }>
    >`SELECT p.id AS "produtoId", p.nome AS nome,
        CASE WHEN ls."last_sale" IS NULL THEN ${days} + 1
             ELSE FLOOR(EXTRACT(EPOCH FROM (NOW() - ls."last_sale")) / 86400)::int
        END AS "diasSemVenda"
      FROM "produto" p
      LEFT JOIN (
        SELECT pv."produtoId", MAX(nf."data") AS "last_sale"
        FROM "produto_venda" pv
        JOIN "nota_fiscal_venda" nf ON pv."notaFiscalId" = nf.id
        GROUP BY pv."produtoId"
      ) ls ON ls."produtoId" = p.id
      WHERE p."ativo" = true
        AND (ls."last_sale" IS NULL OR ls."last_sale" < ${cutoffDate})
      ORDER BY "diasSemVenda" DESC`;

    return rows.map((r) => ({
      produtoId: Number(r.produtoId),
      nome: r.nome,
      diasSemVenda: Number(r.diasSemVenda ?? 0),
    }));
  }

  async getProdutosProximaValidade(
    days: number = 30,
  ): Promise<{ produtoId: number; nome: string; diasParaVencimento: number }[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);

    const rows = await this.prisma.$queryRaw<
      Array<{
        produtoId: number;
        nome: string;
        dataValidade: Date;
        diasParaVencimento: number | string;
      }>
    >`SELECT pe."produtoId" AS "produtoId", p.nome AS nome, pe."dataValidade" AS "dataValidade",
        FLOOR(EXTRACT(EPOCH FROM (pe."dataValidade" - NOW())) / 86400)::int AS "diasParaVencimento"
      FROM "produto_estoque" pe
      JOIN "produto" p ON p.id = pe."produtoId"
      WHERE pe."dataValidade" IS NOT NULL AND pe."dataValidade" <= ${cutoffDate} AND pe."quantidade" > 0 and pe.id <> 1
      ORDER BY pe."dataValidade" ASC`;

    return rows.map((r) => ({
      produtoId: Number(r.produtoId),
      nome: r.nome,
      diasParaVencimento: Number(r.diasParaVencimento ?? 0),
    }));
  }

  // ===== Purchases Reports =====
  async getHistoricoComprasPorProduto(
    produtoId: number,
  ): Promise<
    { data: Date; quantidade: number; precoUnitario: number; total: number; fornecedor: string }[]
  > {
    const rows = await this.prisma.$queryRaw<
      Array<{
        data: Date;
        quantidade: number | string;
        precoUnitario: number | string;
        total: number | string;
        fornecedor: string;
      }>
    >`SELECT nf."data" AS data, pc.quantidade AS quantidade, pc."precoUnitario" AS "precoUnitario",
        (pc.quantidade * pc."precoUnitario")::double precision AS total, f.nome AS fornecedor
      FROM "produto_compra" pc
      JOIN "nota_fiscal_compra" nf ON pc."notaFiscalId" = nf.id
      JOIN "fornecedor" f ON nf."fornecedorId" = f.id
      WHERE pc."produtoId" = ${produtoId}
      ORDER BY nf."data" DESC`;

    return rows.map((r) => ({
      data: new Date(r.data),
      quantidade: Number(r.quantidade ?? 0),
      precoUnitario: this.toNumber(r.precoUnitario),
      total: this.toNumber(r.total),
      fornecedor: r.fornecedor,
    }));
  }

  async getComprasPorFornecedor(): Promise<
    { fornecedorId: number; nome: string; totalCompras: number; totalValor: number }[]
  > {
    const rows = await this.prisma.$queryRaw<
      Array<{
        fornecedorId: number;
        nome: string;
        totalCompras: number | string;
        totalValor: number | string;
      }>
    >`SELECT nf."fornecedorId" AS "fornecedorId", f.nome AS nome, COUNT(nf.id)::int AS "totalCompras", COALESCE(SUM(nf."total"),0)::double precision AS "totalValor"
      FROM "nota_fiscal_compra" nf
      JOIN "fornecedor" f ON f.id = nf."fornecedorId"
      GROUP BY nf."fornecedorId", f.nome
      ORDER BY "totalValor" DESC`;

    return rows.map((r) => ({
      fornecedorId: Number(r.fornecedorId),
      nome: r.nome,
      totalCompras: Number(r.totalCompras ?? 0),
      totalValor: this.toNumber(r.totalValor),
    }));
  }

  async getCustosAquisiçãoPorProduto(
    produtoId: number,
  ): Promise<{ data: Date; precoMedio: number }[]> {
    const rows = await this.prisma.$queryRaw<
      Array<{ data: Date; precoMedio: number | string }>
    >`SELECT nf."data" AS data, AVG(pc."precoUnitario")::double precision AS "precoMedio"
      FROM "produto_compra" pc
      JOIN "nota_fiscal_compra" nf ON pc."notaFiscalId" = nf.id
      WHERE pc."produtoId" = ${produtoId}
      GROUP BY nf.id, nf."data"
      HAVING AVG(pc."precoUnitario") IS NOT NULL
      ORDER BY nf."data" ASC`;

    return rows.map((r) => ({
      data: new Date(r.data),
      precoMedio: this.toNumber(r.precoMedio),
    }));
  }

  // ===== Consolidated Reports =====
  async getAnaliseCoberturaEstoque(days: number = 30): Promise<
    {
      produtoId: number;
      nome: string;
      estoqueAtual: number;
      mediaVendasDiaria: number;
      diasCobertura: number;
    }[]
  > {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const rows = await this.prisma.$queryRaw<
      Array<{
        produtoId: number;
        nome: string;
        estoqueAtual: number | string;
        totalVendas: number | string;
      }>
    >`WITH vendas AS (
        SELECT pv."produtoId", SUM(pv.quantidade)::int AS totalVendas
        FROM "produto_venda" pv
        JOIN "nota_fiscal_venda" nf ON pv."notaFiscalId" = nf.id
        WHERE nf."data" >= ${startDate}
        GROUP BY pv."produtoId"
      ), estoques AS (
        SELECT pe."produtoId", COALESCE(SUM(pe.quantidade),0)::int AS estoqueTotal
        FROM "produto_estoque" pe
        GROUP BY pe."produtoId"
      )
      SELECT v."produtoId" AS "produtoId", p.nome AS nome, COALESCE(e.estoqueTotal,0)::int AS "estoqueAtual", COALESCE(v.totalVendas,0)::int AS "totalVendas"
      FROM vendas v
      LEFT JOIN estoques e ON e."produtoId" = v."produtoId"
      LEFT JOIN "produto" p ON p.id = v."produtoId"`;

    const results = rows.map((r) => {
      const totalVendas = this.toNumber(r.totalVendas);
      const estoqueTotal = this.toNumber(r.estoqueAtual);
      const mediaVendasDiaria = totalVendas / days;
      const diasCobertura = mediaVendasDiaria > 0 ? estoqueTotal / mediaVendasDiaria : 999;
      return {
        produtoId: Number(r.produtoId),
        nome: r.nome,
        estoqueAtual: estoqueTotal,
        mediaVendasDiaria,
        diasCobertura,
      };
    });

    results.sort((a, b) => a.diasCobertura - b.diasCobertura);
    return results;
  }

  async getNecessidadeCompra(
    leadTimeDias: number = 7,
    estoqueMinimo: number = 10,
  ): Promise<{ produtoId: number; nome: string; quantidadeSugestao: number; razao: string }[]> {
    // Usaremos um período base de 30 dias para média de vendas (mesma lógica original)
    const days = 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const rows = await this.prisma.$queryRaw<
      Array<{
        produtoId: number;
        nome: string;
        estoqueAtual: number | string;
        totalVendas: number | string;
      }>
    >`WITH vendas AS (
        SELECT pv."produtoId", SUM(pv.quantidade)::int AS totalVendas
        FROM "produto_venda" pv
        JOIN "nota_fiscal_venda" nf ON pv."notaFiscalId" = nf.id
        WHERE nf."data" >= ${startDate}
        GROUP BY pv."produtoId"
      ), estoques AS (
        SELECT pe."produtoId", COALESCE(SUM(pe.quantidade),0)::int AS estoqueTotal
        FROM "produto_estoque" pe
        GROUP BY pe."produtoId"
      )
      SELECT v."produtoId" AS "produtoId", p.nome AS nome, COALESCE(e.estoqueTotal,0)::int AS "estoqueAtual", COALESCE(v.totalVendas,0)::int AS "totalVendas"
      FROM vendas v
      LEFT JOIN estoques e ON e."produtoId" = v."produtoId"
      LEFT JOIN "produto" p ON p.id = v."produtoId"`;

    const necessidades = rows
      .map((r) => {
        const totalVendas = this.toNumber(r.totalVendas);
        const estoqueAtual = this.toNumber(r.estoqueAtual);
        const mediaVendasDiaria = totalVendas / days;
        const quantidadeSugestao = Math.max(
          0,
          Math.round(mediaVendasDiaria * leadTimeDias + estoqueMinimo - estoqueAtual),
        );
        let razao = '';
        const diasCobertura = mediaVendasDiaria > 0 ? estoqueAtual / mediaVendasDiaria : 999;
        if (diasCobertura < leadTimeDias) razao = 'Cobertura insuficiente para lead time';
        else if (estoqueAtual < estoqueMinimo) razao = 'Abaixo do estoque mínimo';
        else if (quantidadeSugestao > 0) razao = 'Manter níveis de segurança';
        else razao = 'Sem necessidade imediata';
        return {
          produtoId: Number(r.produtoId),
          nome: r.nome,
          quantidadeSugestao,
          razao,
        };
      })
      .filter((n) => n.quantidadeSugestao > 0);

    return necessidades;
  }

  async getLucratividadePorCategoria(): Promise<
    {
      categoriaId: number;
      nome: string;
      receita: number;
      custo: number;
      lucro: number;
      margem: number;
    }[]
  > {
    const rows = await this.prisma.$queryRaw<
      Array<{ categoriaId: number; nome: string; receita: number | string; custo: number | string }>
    >`SELECT c.id AS "categoriaId", c.name AS nome,
        COALESCE(v.receita,0)::double precision AS receita,
        COALESCE(comp.custo,0)::double precision AS custo
      FROM "categoria" c
      LEFT JOIN (
        SELECT p."categoriaId", SUM(pv."precoUnitario"*pv.quantidade) AS receita
        FROM "produto_venda" pv
        JOIN "produto" p ON p.id = pv."produtoId"
        WHERE p."categoriaId" IS NOT NULL
        GROUP BY p."categoriaId"
      ) v ON v."categoriaId" = c.id
      LEFT JOIN (
        SELECT p."categoriaId", SUM(pc."precoUnitario"*pc.quantidade) AS custo
        FROM "produto_compra" pc
        JOIN "produto" p ON p.id = pc."produtoId"
        WHERE p."categoriaId" IS NOT NULL
        GROUP BY p."categoriaId"
      ) comp ON comp."categoriaId" = c.id
      WHERE c.id IS NOT NULL
      ORDER BY (COALESCE(v.receita,0) - COALESCE(comp.custo,0)) DESC`;

    return rows.map((r) => {
      const receita = this.toNumber(r.receita);
      const custo = this.toNumber(r.custo);
      const lucro = receita - custo;
      const margem = receita > 0 ? (lucro / receita) * 100 : 0;
      return {
        categoriaId: Number(r.categoriaId),
        nome: r.nome,
        receita,
        custo,
        lucro,
        margem,
      };
    });
  }

  async getAnaliseRupturaEstoque(
    days: number = 30,
  ): Promise<
    { produtoId: number; nome: string; rupturas: number; vendasPerdidasEstimadas: number }[]
  > {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const rows = await this.prisma.$queryRaw<
      Array<{
        produtoId: number;
        nome: string;
        rupturas: number | string;
        totalVendas: number | string;
      }>
    >`WITH vendas AS (
        SELECT pv."produtoId", SUM(pv.quantidade)::int AS totalVendas
        FROM "produto_venda" pv
        JOIN "nota_fiscal_venda" nf ON pv."notaFiscalId" = nf.id
        WHERE nf."data" >= ${startDate}
        GROUP BY pv."produtoId"
      ), rupturas AS (
        SELECT pe."produtoId", COUNT(*)::int AS rupturas
        FROM "produto_estoque" pe
        WHERE pe."quantidade" <= 0
        GROUP BY pe."produtoId"
      )
      SELECT r."produtoId" AS "produtoId", p.nome AS nome, r.rupturas AS rupturas, COALESCE(v.totalVendas,0)::int AS totalVendas
      FROM rupturas r
      LEFT JOIN vendas v ON v."produtoId" = r."produtoId"
      LEFT JOIN "produto" p ON p.id = r."produtoId"
      ORDER BY r.rupturas DESC`;

    return rows.map((r) => {
      const rupturas = Number(r.rupturas ?? 0);
      const totalVendas = this.toNumber(r.totalVendas);
      const vendasPerdidasEstimadas = Math.round(rupturas * (totalVendas / days));
      return {
        produtoId: Number(r.produtoId),
        nome: r.nome,
        rupturas,
        vendasPerdidasEstimadas,
      };
    });
  }
}
