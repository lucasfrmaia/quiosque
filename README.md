# 🏝️ **Quiosque**

Um **painel administrativo moderno, leve e modular**, desenvolvido com **Next.js**, **TypeScript**, **Prisma** e **TailwindCSS**.

O **Quiosque** foi projetado para simplificar a **gestão de produtos, estoque, notas fiscais e relatórios**, oferecendo uma base sólida para expansão e personalização de acordo com as necessidades do seu negócio.

---

## 🚀 **Principais Tecnologias**

- ⚡ **Next.js (App Router)** — arquitetura moderna e performática
- 🧠 **TypeScript** — tipagem estática e segurança no desenvolvimento
- 🗃️ **Prisma ORM** — abstração poderosa para manipular bancos de dados
- 🎨 **TailwindCSS** — estilização rápida e responsiva
- 🧩 **Componentes e hooks modulares** — fácil manutenção e reuso
- 🐳 **Docker & Docker Compose** — ambiente pronto para produção e desenvolvimento
- 📁 **Banco configurado via Prisma** — veja o arquivo [`prisma/schema.prisma`](prisma/schema.prisma)

---

## 🧱 **Estrutura do Projeto**

```bash
├── app/                 # Rotas e páginas (Next.js App Router)
├── components/          # Componentes reutilizáveis
├── hooks/               # Hooks customizados
├── prisma/              # Esquema e migrações do banco
├── styles/              # Estilos globais e configurações Tailwind
├── docker-compose.yml   # Configuração do ambiente Docker
└── README.md
```

---

## ⚙️ **Como Executar o Projeto**

### 🐳 1. Pré-requisitos

Certifique-se de ter o **Docker** e o **Docker Compose** instalados e funcionando corretamente.

### ▶️ 2. Subir os containers

No diretório raiz do projeto, execute:

```bash
docker-compose up --build -d
```

### 🔧 3. Inicializar o Prisma

Após os containers estarem ativos, acesse o container **web** e execute:

```bash
npx prisma generate
npx prisma db push
```

Em seguida, **reinicie os containers** para aplicar as alterações:

```bash
docker-compose restart
```
