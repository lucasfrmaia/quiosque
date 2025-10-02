import { PrismaClient, Prisma } from '@prisma/client';

export class Relatorio {
  private readonly prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async getTotalVendas(): Promise<number> {
    const total = await this.prisma.notaFiscalVenda.aggregate({
      _sum: {
        total: true,
      },
    });
    return total._sum.total || 0;
  }

  async getTotalGastos(): Promise<number> {
    const total = await this.prisma.notaFiscalCompra.aggregate({
      _sum: {
        total: true,
      },
    });
    return total._sum.total || 0;
  }

  async getProdutosEmEstoque(): Promise<number> {
    const total = await this.prisma.produtoEstoque.aggregate({
      _sum: {
        quantidade: true,
      },
    });
    return total._sum.quantidade || 0;
  }

  async getTotalNotas(): Promise<number> {
    const [comprasCount, vendasCount] = await Promise.all([
      this.prisma.notaFiscalCompra.count(),
      this.prisma.notaFiscalVenda.count(),
    ]);
    return comprasCount + vendasCount;
  }

  // Sales Reports
  async getVendasPorPeriodo(periodo: 'daily' | 'weekly' | 'monthly' | 'annual'): Promise<{ data: Date; total: number; count: number }[]> {
    let where: Prisma.NotaFiscalVendaWhereInput = {};
    const now = new Date();
    let startDate: Date;

    switch (periodo) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        where.data = { gte: startDate };
        break;
      case 'weekly':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        where.data = { gte: startOfWeek };
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        where.data = { gte: startDate };
        break;
      case 'annual':
        startDate = new Date(now.getFullYear(), 0, 1);
        where.data = { gte: startDate };
        break;
      default:
        throw new Error('Período inválido');
    }

    const vendas = await this.prisma.notaFiscalVenda.groupBy({
      by: ['data'],
      where,
      _sum: { total: true },
      _count: { id: true },
    });

    return vendas.map(v => ({
      data: v.data,
      total: v._sum.total || 0,
      count: v._count.id,
    }));
  }

  async getComparativoPeriodos(startDate1: Date, endDate1: Date, startDate2: Date, endDate2: Date): Promise<{ periodo1: { total: number; count: number }; periodo2: { total: number; count: number } }> {
    const vendas1 = await this.prisma.notaFiscalVenda.aggregate({
      where: { data: { gte: startDate1, lt: endDate1 } },
      _sum: { total: true },
      _count: { id: true },
    });

    const vendas2 = await this.prisma.notaFiscalVenda.aggregate({
      where: { data: { gte: startDate2, lt: endDate2 } },
      _sum: { total: true },
      _count: { id: true },
    });

    return {
      periodo1: { total: vendas1._sum.total || 0, count: vendas1._count.id },
      periodo2: { total: vendas2._sum.total || 0, count: vendas2._count.id },
    };
  }

  async getProdutosMaisVendidos(limit: number = 10, by: 'quantidade' | 'faturamento' = 'faturamento'): Promise<{ produtoId: number; nome: string; totalQuantidade: number; totalFaturamento: number }[]> {
    const vendas = await this.prisma.notaFiscalVenda.findMany({
      include: {
        produtos: {
          include: {
            produto: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
      },
    });

    const produtoStats = new Map<number, { nome: string; quantidade: number; faturamento: number }>();

    vendas.forEach(nf => {
      nf.produtos.forEach(pv => {
        const id = pv.produtoId;
        const nome = pv.produto.nome;
        const existing = produtoStats.get(id) || { nome, quantidade: 0, faturamento: 0 };
        existing.quantidade += pv.quantidade;
        existing.faturamento += pv.precoUnitario * pv.quantidade;
        produtoStats.set(id, existing);
      });
    });

    const results = Array.from(produtoStats.values());

    results.sort((a, b) => by === 'quantidade' ? b.quantidade - a.quantidade : b.faturamento - a.faturamento);

    return results.slice(0, limit).map(item => ({
      produtoId: 0, // Not tracked
      nome: item.nome,
      totalQuantidade: item.quantidade,
      totalFaturamento: item.faturamento,
    }));
  }

  async getVendasPorCategoria(): Promise<{ categoriaId: number; nome: string; totalVendas: number; totalQuantidade: number }[]> {
    const vendas = await this.prisma.notaFiscalVenda.findMany({
      include: {
        produtos: {
          include: {
            produto: {
              include: {
                categoria: true,
              },
            },
          },
        },
      },
    });

    const categoriaStats = new Map<number, { nome: string; quantidade: number; vendas: number }>();

    vendas.forEach(nf => {
      nf.produtos.forEach(pv => {
        const cat = pv.produto.categoria;
        if (cat) {
          const id = cat.id;
          const existing = categoriaStats.get(id) || { nome: cat.name, quantidade: 0, vendas: 0 };
          existing.quantidade += pv.quantidade;
          existing.vendas += pv.precoUnitario * pv.quantidade;
          categoriaStats.set(id, existing);
        }
      });
    });

    const results = Array.from(categoriaStats.values());

    results.sort((a, b) => b.vendas - a.vendas);

    return results.map(item => ({
      categoriaId: 0, // Not tracked
      nome: item.nome,
      totalVendas: item.vendas,
      totalQuantidade: item.quantidade,
    }));
  }

  async getMargemLucroPorProduto(limit: number = 10): Promise<{ produtoId: number; nome: string; margem: number }[]> {
    const vendas = await this.prisma.notaFiscalVenda.findMany({
      include: {
        produtos: {
          include: {
            produto: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
      },
    });

    const compras = await this.prisma.notaFiscalCompra.findMany({
      include: {
        produtos: {
          include: {
            produto: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
      },
    });

    const produtoStats = new Map<number, { nome: string; revenue: number; cost: number }>();

    // Revenue from sales
    vendas.forEach(nf => {
      nf.produtos.forEach(pv => {
        const id = pv.produtoId;
        const nome = pv.produto.nome;
        const existing = produtoStats.get(id) || { nome, revenue: 0, cost: 0 };
        existing.revenue += pv.precoUnitario * pv.quantidade;
        produtoStats.set(id, existing);
      });
    });

    // Cost from purchases
    compras.forEach(nf => {
      nf.produtos.forEach(pc => {
        const id = pc.produtoId;
        const nome = pc.produto.nome;
        const existing = produtoStats.get(id) || { nome, revenue: 0, cost: 0 };
        existing.cost += pc.precoUnitario * pc.quantidade;
        produtoStats.set(id, existing);
      });
    });

    const results = Array.from(produtoStats.values()).map(item => {
      const margem = item.revenue > 0 ? ((item.revenue - item.cost) / item.revenue) * 100 : 0;
      return {
        produtoId: 0, // Not tracked
        nome: item.nome,
        margem,
      };
    });

    results.sort((a, b) => b.margem - a.margem);
    return results.slice(0, limit);
  }

  // Stock Reports
  async getPosicaoEstoqueAtual(): Promise<{ produtoId: number; nome: string; quantidade: number; preco: number; valorTotal: number }[]> {
    const estoques = await this.prisma.produtoEstoque.groupBy({
      by: ['produtoId'],
      _sum: { quantidade: true },
      _avg: { preco: true },
    });

    const produtoIds = [...new Set(estoques.map(e => e.produtoId))];
    const produtos = await this.prisma.produto.findMany({
      where: {
        id: {
          in: produtoIds,
        },
      },
      select: {
        id: true,
        nome: true,
      },
    });

    const produtoMap = new Map(produtos.map(p => [p.id, p.nome]));

    return estoques.map(e => {
      const quantidade = e._sum.quantidade || 0;
      const preco = e._avg.preco || 0;
      const valorTotal = quantidade * preco;
      return {
        produtoId: e.produtoId,
        nome: produtoMap.get(e.produtoId) || '',
        quantidade,
        preco,
        valorTotal,
      };
    });
  }

  async getCurvaABCEstoque(): Promise<{ produtoId: number; nome: string; valorEstoque: number; categoria: 'A' | 'B' | 'C' }[]> {
    const estoques = await this.prisma.produtoEstoque.findMany({
      include: {
        produto: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });

    const stats = new Map<number, { nome: string; valor: number }>();

    estoques.forEach(pe => {
      const id = pe.produtoId;
      const nome = pe.produto.nome;
      const existing = stats.get(id) || { nome, valor: 0 };
      existing.valor += pe.quantidade * pe.preco;
      stats.set(id, existing);
    });

    const results = Array.from(stats.values());

    let totalValue = results.reduce((sum, r) => sum + r.valor, 0);

    results.sort((a, b) => b.valor - a.valor);

    return results.map((item, index) => {
      let cumulative = 0;
      for (let i = 0; i <= index; i++) {
        cumulative += (results[i].valor / totalValue) * 100;
      }
      let categoria: 'A' | 'B' | 'C';
      if (cumulative <= 80) categoria = 'A';
      else if (cumulative <= 95) categoria = 'B';
      else categoria = 'C';
      return {
        produtoId: 0, // Not tracked
        nome: item.nome,
        valorEstoque: item.valor,
        categoria,
      };
    });
  }

  async getGiroEstoque(periodo: 'monthly' | 'annual' = 'monthly'): Promise<{ produtoId: number; nome: string; giro: number }[]> {
    const now = new Date();
    let startDate: Date;
    if (periodo === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    } else {
      startDate = new Date(now.getFullYear(), 0, 1);
    }
    const endDate = now;

    const compras = await this.prisma.notaFiscalCompra.findMany({
      where: {
        data: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        produtos: true,
      },
    });

    const estoques = await this.prisma.produtoEstoque.findMany();

    const custoVendidoMap = new Map<number, number>();
    compras.forEach(nf => {
      nf.produtos.forEach(pc => {
        const id = pc.produtoId;
        const existing = custoVendidoMap.get(id) || 0;
        custoVendidoMap.set(id, existing + (pc.precoUnitario * pc.quantidade));
      });
    });

    const estoqueMap = new Map<number, number>();
    estoques.forEach(pe => {
      const id = pe.produtoId;
      const existing = estoqueMap.get(id) || 0;
      estoqueMap.set(id, existing + pe.quantidade);
    });

    const produtos = await this.prisma.produto.findMany({
      where: {
        id: {
          in: Array.from(new Set([...Array.from(custoVendidoMap.keys()), ...Array.from(estoqueMap.keys())])),
        },
      },
      select: {
        id: true,
        nome: true,
      },
    });

    const results = produtos.map(p => {
      const custoVendido = custoVendidoMap.get(p.id) || 0;
      const totalEstoque = estoqueMap.get(p.id) || 0;
      const estoqueMedio = estoques.length > 0 ? totalEstoque / estoques.length : 0;
      const giro = estoqueMedio > 0 ? custoVendido / estoqueMedio : 0;
      return {
        produtoId: p.id,
        nome: p.nome,
        giro,
      };
    });

    results.sort((a, b) => b.giro - a.giro);
    return results;
  }

  async getProdutosBaixoEstoque(minLevel: number = 10): Promise<{ produtoId: number; nome: string; quantidadeAtual: number }[]> {
    const produtos = await this.prisma.produto.findMany({
      where: {
        ativo: true,
      },
      include: {
        estoques: true,
      },
    });

    const results = produtos
      .map(p => {
        const quantidadeAtual = p.estoques.reduce((sum, e) => sum + e.quantidade, 0);
        if (quantidadeAtual <= minLevel) {
          return {
            produtoId: p.id,
            nome: p.nome,
            quantidadeAtual,
          };
        }
        return null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    results.sort((a, b) => a.quantidadeAtual - b.quantidadeAtual);
    return results;
  }

  async getProdutosSemGiro(days: number = 90): Promise<{ produtoId: number; nome: string; diasSemVenda: number }[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const vendas = await this.prisma.notaFiscalVenda.findMany({
      where: {
        data: {
          lt: cutoffDate,
        },
      },
      include: {
        produtos: {
          select: {
            produtoId: true,
          },
        },
      },
    });

    const lastSaleMap = new Map<number, Date>();
    vendas.forEach(nf => {
      nf.produtos.forEach(pv => {
        const id = pv.produtoId;
        if (!lastSaleMap.has(id) || nf.data > lastSaleMap.get(id)!) {
          lastSaleMap.set(id, nf.data);
        }
      });
    });

    const produtos = await this.prisma.produto.findMany({
      where: {
        ativo: true,
      },
    });

    const results = produtos
      .filter(p => {
        const lastSale = lastSaleMap.get(p.id);
        return !lastSale || lastSale < cutoffDate;
      })
      .map(p => {
        const lastSale = lastSaleMap.get(p.id);
        const diasSemVenda = lastSale 
          ? Math.floor((new Date().getTime() - lastSale.getTime()) / (1000 * 60 * 60 * 24))
          : days + 1;
        return {
          produtoId: p.id,
          nome: p.nome,
          diasSemVenda,
        };
      });

    results.sort((a, b) => b.diasSemVenda - a.diasSemVenda);
    return results;
  }

  async getProdutosProximaValidade(days: number = 30): Promise<{ produtoId: number; nome: string; diasParaVencimento: number }[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);

    const estoques = await this.prisma.produtoEstoque.findMany({
      where: {
        dataValidade: {
          not: null,
          lte: cutoffDate,
        },
        quantidade: {
          gt: 0,
        },
      },
      include: {
        produto: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
      orderBy: {
        dataValidade: 'asc',
      },
    });

    return estoques.map(pe => {
      const diasParaVencimento = Math.floor((pe.dataValidade!.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return {
        produtoId: pe.produto.id,
        nome: pe.produto.nome,
        diasParaVencimento,
      };
    });
  }

  // Purchases Reports
  async getHistoricoComprasPorProduto(produtoId: number): Promise<{ data: Date; quantidade: number; precoUnitario: number; total: number; fornecedor: string }[]> {
    const historico = await this.prisma.produtoCompra.findMany({
      where: {
        produtoId,
      },
      include: {
        notaFiscal: {
          select: {
            data: true,
            fornecedor: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
      orderBy: {
        notaFiscal: {
          data: 'desc',
        },
      },
    });

    return historico.map(pc => ({
      data: pc.notaFiscal.data,
      quantidade: pc.quantidade,
      precoUnitario: pc.precoUnitario,
      total: pc.quantidade * pc.precoUnitario,
      fornecedor: pc.notaFiscal.fornecedor.nome,
    }));
  }

  async getComprasPorFornecedor(): Promise<{ fornecedorId: number; nome: string; totalCompras: number; totalValor: number }[]> {
    const compras = await this.prisma.notaFiscalCompra.groupBy({
      by: ['fornecedorId'],
      _count: { id: true },
      _sum: { total: true },
    });

    const fornecedorIds = [...new Set(compras.map(c => c.fornecedorId))];
    const fornecedores = await this.prisma.fornecedor.findMany({
      where: {
        id: {
          in: fornecedorIds,
        },
      },
      select: {
        id: true,
        nome: true,
      },
    });

    const fornecedorMap = new Map(fornecedores.map(f => [f.id, f.nome]));

    return compras.map(c => ({
      fornecedorId: c.fornecedorId,
      nome: fornecedorMap.get(c.fornecedorId) || '',
      totalCompras: c._count.id,
      totalValor: c._sum.total || 0,
    })).sort((a, b) => (b.totalValor || 0) - (a.totalValor || 0));
  }

  async getCustosAquisiçãoPorProduto(produtoId: number): Promise<{ data: Date; precoMedio: number }[]> {
    const custos = await this.prisma.produtoCompra.groupBy({
      by: ['notaFiscalId'],
      _avg: { precoUnitario: true },
      where: {
        produtoId,
      },
    });

    const notaIds = [...new Set(custos.map(c => c.notaFiscalId))];
    const notas = await this.prisma.notaFiscalCompra.findMany({
      where: {
        id: {
          in: notaIds,
        },
      },
      select: {
        id: true,
        data: true,
      },
    });

    const notaMap = new Map(notas.map(n => [n.id, n.data]));

    return custos
      .map(c => ({
        data: notaMap.get(c.notaFiscalId)!,
        precoMedio: c._avg.precoUnitario || 0,
      }))
      .filter(item => item.data !== undefined)
      .sort((a, b) => a.data.getTime() - b.data.getTime());
  }

  // Consolidated Reports
  async getAnaliseCoberturaEstoque(days: number = 30): Promise<{ produtoId: number; nome: string; estoqueAtual: number; mediaVendasDiaria: number; diasCobertura: number }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const vendas = await this.prisma.notaFiscalVenda.findMany({
      where: {
        data: {
          gte: startDate,
        },
      },
      include: {
        produtos: true,
      },
    });

    const estoques = await this.prisma.produtoEstoque.groupBy({
      by: ['produtoId'],
      _sum: { quantidade: true },
    });

    const vendasMap = new Map<number, number>();
    vendas.forEach(nf => {
      nf.produtos.forEach(pv => {
        const id = pv.produtoId;
        const existing = vendasMap.get(id) || 0;
        vendasMap.set(id, existing + pv.quantidade);
      });
    });

    const produtoIds = [...new Set(Array.from(vendasMap.keys()))];
    const produtos = await this.prisma.produto.findMany({
      where: {
        id: {
          in: produtoIds,
        },
      },
      select: {
        id: true,
        nome: true,
      },
    });

    const produtoMap = new Map(produtos.map(p => [p.id, p.nome]));

    const results = Array.from(vendasMap.entries()).map(([produtoId, totalVendas]) => {
      const mediaVendasDiaria = totalVendas / days;
      const estoqueTotal = estoques.find(e => e.produtoId === produtoId)?._sum?.quantidade || 0;
      const diasCobertura = mediaVendasDiaria > 0 ? estoqueTotal / mediaVendasDiaria : 999;
      return {
        produtoId,
        nome: produtoMap.get(produtoId) || '',
        estoqueAtual: estoqueTotal,
        mediaVendasDiaria,
        diasCobertura,
      };
    });

    results.sort((a, b) => a.diasCobertura - b.diasCobertura);
    return results;
  }

  async getNecessidadeCompra(leadTimeDias: number = 7, estoqueMinimo: number = 10): Promise<{ produtoId: number; nome: string; quantidadeSugestao: number; razao: string }[]> {
    const cobertura = await this.getAnaliseCoberturaEstoque(30);

    const necessidades = cobertura.map(c => {
      const quantidadeSugestao = Math.max(0, (c.mediaVendasDiaria * leadTimeDias) + estoqueMinimo - c.estoqueAtual);
      let razao = '';
      if (c.diasCobertura < leadTimeDias) razao = 'Cobertura insuficiente para lead time';
      else if (c.estoqueAtual < estoqueMinimo) razao = 'Abaixo do estoque mínimo';
      else if (quantidadeSugestao > 0) razao = 'Manter níveis de segurança';
      else razao = 'Sem necessidade imediata';
      return {
        produtoId: c.produtoId,
        nome: c.nome,
        quantidadeSugestao: Math.round(quantidadeSugestao),
        razao,
      };
    }).filter(n => n.quantidadeSugestao > 0);

    return necessidades;
  }

  async getLucratividadePorCategoria(): Promise<{ categoriaId: number; nome: string; receita: number; custo: number; lucro: number; margem: number }[]> {
    const vendas = await this.prisma.notaFiscalVenda.findMany({
      include: {
        produtos: {
          include: {
            produto: {
              include: {
                categoria: true,
              },
            },
          },
        },
      },
    });

    const compras = await this.prisma.notaFiscalCompra.findMany({
      include: {
        produtos: {
          include: {
            produto: {
              include: {
                categoria: true,
              },
            },
          },
        },
      },
    });

    const categoriaStats = new Map<number, { nome: string; receita: number; custo: number }>();

    // Revenue
    vendas.forEach(nf => {
      nf.produtos.forEach(pv => {
        const cat = pv.produto.categoria;
        if (cat) {
          const id = cat.id;
          const existing = categoriaStats.get(id) || { nome: cat.name, receita: 0, custo: 0 };
          existing.receita += pv.precoUnitario * pv.quantidade;
          categoriaStats.set(id, existing);
        }
      });
    });

    // Cost
    compras.forEach(nf => {
      nf.produtos.forEach(pc => {
        const cat = pc.produto.categoria;
        if (cat) {
          const id = cat.id;
          const existing = categoriaStats.get(id) || { nome: cat.name, receita: 0, custo: 0 };
          existing.custo += pc.precoUnitario * pc.quantidade;
          categoriaStats.set(id, existing);
        }
      });
    });

    const results = Array.from(categoriaStats.values()).map(item => {
      const lucro = item.receita - item.custo;
      const margem = item.receita > 0 ? (lucro / item.receita) * 100 : 0;
      return {
        categoriaId: 0, // Not tracked
        nome: item.nome,
        receita: item.receita,
        custo: item.custo,
        lucro,
        margem,
      };
    });

    results.sort((a, b) => b.lucro - a.lucro);
    return results;
  }

  async getAnaliseRupturaEstoque(days: number = 30): Promise<{ produtoId: number; nome: string; rupturas: number; vendasPerdidasEstimadas: number }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const vendas = await this.prisma.notaFiscalVenda.findMany({
      where: {
        data: {
          gte: startDate,
        },
      },
      include: {
        produtos: true,
      },
    });

    const estoquesZero = await this.prisma.produtoEstoque.findMany({
      where: {
        quantidade: {
          lte: 0,
        },
      },
      include: {
        produto: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });

    const rupturasMap = new Map<number, number>();
    estoquesZero.forEach(pe => {
      rupturasMap.set(pe.produtoId, (rupturasMap.get(pe.produtoId) || 0) + 1);
    });

    const mediaVendasMap = new Map<number, number>();
    vendas.forEach(nf => {
      nf.produtos.forEach(pv => {
        const id = pv.produtoId;
        const existing = mediaVendasMap.get(id) || 0;
        mediaVendasMap.set(id, existing + pv.quantidade);
      });
    });

    const results = Array.from(rupturasMap.entries()).map(([produtoId, rupturas]) => {
      const mediaVendas = mediaVendasMap.get(produtoId) || 0;
      const vendasPerdidasEstimadas = rupturas * (mediaVendas / days);
      const produto = estoquesZero.find(pe => pe.produtoId === produtoId)?.produto;
      return {
        produtoId,
        nome: produto?.nome || '',
        rupturas,
        vendasPerdidasEstimadas: Math.round(vendasPerdidasEstimadas),
      };
    });

    results.sort((a, b) => b.rupturas - a.rupturas);
    return results;
  }
}
