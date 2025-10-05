const createProdutos = async () => {
  const produtos = [
    {
      nome: 'Refrigerante Coca-Cola Lata',
      descricao: 'Coca-Cola lata 350ml bem gelada.',
      imagemUrl:
        'https://www.coca-cola.com/content/dam/onexp/br/pt/products/coca-cola-lata-350ml.png',
      ativo: true,
      tipo: 'CARDAPIO',
      categoriaId: 17,
    },
    {
      nome: 'Refrigerante Guaraná Antarctica Lata',
      descricao: 'Guaraná Antarctica lata 350ml.',
      imagemUrl: 'https://m.media-amazon.com/images/I/71HbQd6v8bL._AC_UL600_FMwebp_QL65_.jpg',
      ativo: true,
      tipo: 'CARDAPIO',
      categoriaId: 17,
    },
    {
      nome: 'Água Mineral sem Gás',
      descricao: 'Garrafa de 500ml de água mineral sem gás.',
      imagemUrl: 'https://m.media-amazon.com/images/I/71xtnl4LPXL._AC_UL600_FMwebp_QL65_.jpg',
      ativo: true,
      tipo: 'CARDAPIO',
      categoriaId: 17,
    },
    {
      nome: 'Água Mineral com Gás',
      descricao: 'Garrafa de 500ml de água mineral com gás.',
      imagemUrl: 'https://m.media-amazon.com/images/I/61EMpjh7n7L._AC_UL600_FMwebp_QL65_.jpg',
      ativo: true,
      tipo: 'CARDAPIO',
      categoriaId: 17,
    },
    {
      nome: 'Suco de Laranja Natural',
      descricao: 'Suco natural de laranja 300ml.',
      imagemUrl: 'https://m.media-amazon.com/images/I/71GpX3RNIeL._AC_UL600_FMwebp_QL65_.jpg',
      ativo: true,
      tipo: 'CARDAPIO',
      categoriaId: 17,
    },
    {
      nome: 'Pipoca Doce',
      descricao: 'Pipoca caramelizada crocante.',
      imagemUrl: 'https://m.media-amazon.com/images/I/81x1-FBoI1L._AC_UL600_FMwebp_QL65_.jpg',
      ativo: true,
      tipo: 'CARDAPIO',
      categoriaId: 17,
    },
    {
      nome: 'Pipoca Salgada',
      descricao: 'Pipoca salgada tradicional.',
      imagemUrl: 'https://m.media-amazon.com/images/I/71sF0Chcx4L._AC_UL600_FMwebp_QL65_.jpg',
      ativo: true,
      tipo: 'CARDAPIO',
      categoriaId: 17,
    },
    {
      nome: 'Cachorro-Quente',
      descricao: 'Pão, salsicha, molho, batata palha.',
      imagemUrl: 'https://m.media-amazon.com/images/I/71bN-ViZSwL._AC_UL600_FMwebp_QL65_.jpg',
      ativo: true,
      tipo: 'CARDAPIO',
      categoriaId: 17,
    },
    {
      nome: 'Hambúrguer Simples',
      descricao: 'Pão, carne 90g, queijo, maionese.',
      imagemUrl: 'https://m.media-amazon.com/images/I/61JeW53mf+L._AC_UL600_FMwebp_QL65_.jpg',
      ativo: true,
      tipo: 'CARDAPIO',
      categoriaId: 17,
    },
    {
      nome: 'X-Burger',
      descricao: 'Pão, hambúrguer, queijo, alface, tomate.',
      imagemUrl: 'https://m.media-amazon.com/images/I/81v01n3f0pL._AC_UL600_FMwebp_QL65_.jpg',
      ativo: true,
      tipo: 'CARDAPIO',
      categoriaId: 17,
    },
    {
      nome: 'Batata Frita',
      descricao: 'Porção de batata frita crocante.',
      imagemUrl: 'https://m.media-amazon.com/images/I/71ybq0Pf-1L._AC_UL600_FMwebp_QL65_.jpg',
      ativo: true,
      tipo: 'CARDAPIO',
      categoriaId: 17,
    },
    {
      nome: 'Salada de Frutas',
      descricao: 'Mix de frutas frescas da estação.',
      imagemUrl: 'https://m.media-amazon.com/images/I/81ZlB5oDgLL._AC_UL600_FMwebp_QL65_.jpg',
      ativo: true,
      tipo: 'CARDAPIO',
      categoriaId: 17,
    },
    {
      nome: 'Pastel de Carne',
      descricao: 'Pastel frito recheado com carne moída.',
      imagemUrl: 'https://m.media-amazon.com/images/I/81r1m6Qhf9L._AC_UL600_FMwebp_QL65_.jpg',
      ativo: true,
      tipo: 'CARDAPIO',
      categoriaId: 17,
    },
    {
      nome: 'Pastel de Queijo',
      descricao: 'Pastel frito recheado com queijo derretido.',
      imagemUrl: 'https://m.media-amazon.com/images/I/81Ax1DPRWcL._AC_UL600_FMwebp_QL65_.jpg',
      ativo: true,
      tipo: 'CARDAPIO',
      categoriaId: 17,
    },
    {
      nome: 'Pastel de Frango',
      descricao: 'Pastel frito recheado com frango desfiado.',
      imagemUrl: 'https://m.media-amazon.com/images/I/81k7HhfH3DL._AC_UL600_FMwebp_QL65_.jpg',
      ativo: true,
      tipo: 'CARDAPIO',
      categoriaId: 17,
    },
    {
      nome: 'Prato Feito - Frango Grelhado',
      descricao: 'Arroz, feijão, salada e frango grelhado.',
      imagemUrl: 'https://m.media-amazon.com/images/I/81rYm9GlhLL._AC_UL600_FMwebp_QL65_.jpg',
      ativo: true,
      tipo: 'CARDAPIO',
      categoriaId: 17,
    },
    {
      nome: 'Prato Feito - Bife Acebolado',
      descricao: 'Arroz, feijão, batata frita e bife acebolado.',
      imagemUrl: 'https://m.media-amazon.com/images/I/71YZkNHISLL._AC_UL600_FMwebp_QL65_.jpg',
      ativo: true,
      tipo: 'CARDAPIO',
      categoriaId: 17,
    },
    {
      nome: 'Prato Feito - Filé de Peixe',
      descricao: 'Arroz, feijão, salada e filé de peixe.',
      imagemUrl: 'https://m.media-amazon.com/images/I/81SVi8h7xwL._AC_UL600_FMwebp_QL65_.jpg',
      ativo: true,
      tipo: 'CARDAPIO',
      categoriaId: 17,
    },
    {
      nome: 'Sorvete no Copo',
      descricao: 'Copo de sorvete sabor variado.',
      imagemUrl: 'https://m.media-amazon.com/images/I/71wqkB6iwLL._AC_UL600_FMwebp_QL65_.jpg',
      ativo: true,
      tipo: 'CARDAPIO',
      categoriaId: 17,
    },
    {
      nome: 'Churros de Doce de Leite',
      descricao: 'Churros fritos recheados com doce de leite.',
      imagemUrl: 'https://m.media-amazon.com/images/I/71p2RLlHb4L._AC_UL600_FMwebp_QL65_.jpg',
      ativo: true,
      tipo: 'CARDAPIO',
      categoriaId: 17,
    },
  ];

  for await (const produto of produtos) {
    await fetch('http://localhost:3000/api/produto/create', {
      method: 'POST',
      body: JSON.stringify(produto),
    });
  }
};

const createCategorias = async () => {
  const categorias = [
    {
      name: 'ALMOCO',
      description:
        'Pratos principais servidos no horário de almoço, incluindo opções com carne, frango e vegetarianas.',
    },
    {
      name: 'LANCHE',
      description: 'Lanches rápidos como sanduíches, coxinhas, pastéis e salgados variados.',
    },
    {
      name: 'BEBIDA',
      description:
        'Bebidas diversas, incluindo refrigerantes, sucos, águas e outras opções não alcoólicas.',
    },
    {
      name: 'SOBREMESA',
      description: 'Doces e sobremesas simples como pudins, gelatinas, tortas e doces caseiros.',
    },
    {
      name: 'PETISCO',
      description:
        'Porções e pequenas refeições para acompanhar bebidas, como batata frita, pastel e calabresa.',
    },
    {
      name: 'CAFETERIA',
      description:
        'Itens à base de café e acompanhamentos, como café expresso, cappuccino e biscoitos.',
    },
    {
      name: 'NATURAL',
      description: 'Produtos naturais e leves como tapioca, saladas e sucos naturais.',
    },
    {
      name: 'SNACK',
      description: 'Pequenos lanches embalados, como pipoca, amendoim e salgadinhos.',
    },
    {
      name: 'ACOMPANHAMENTO',
      description: 'Itens que complementam refeições, como arroz, feijão, farofa e saladas.',
    },
    {
      name: 'REFRIGERADO',
      description: 'Produtos mantidos sob refrigeração, como bebidas geladas e sobremesas frias.',
    },
    { name: 'PROMOCAO', description: 'Itens em destaque com desconto ou combos promocionais.' },
  ];

  for await (const produto of categorias) {
    await fetch('http://localhost:3000/api/category/create', {
      method: 'POST',
      body: JSON.stringify(produto),
    });
  }
};

(async () => {
  await createCategorias();

  console.log('Criou...');
})();
