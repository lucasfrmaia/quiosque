# 🏝️ **Quiosque**

Um **painel administrativo moderno, leve e modular**, desenvolvido com **Next.js**, **TypeScript**, **Prisma** e **TailwindCSS**.

O **Quiosque** foi projetado para simplificar a **gestão de produtos, estoque, notas fiscais e relatórios**, oferecendo uma base sólida para expansão e personalização conforme as necessidades do seu negócio.

---

## 🚀 **Principais Tecnologias**

- ⚡ **Next.js (App Router)** — arquitetura moderna e performática
- 🧠 **TypeScript** — segurança e produtividade no desenvolvimento
- 🗃️ **Prisma ORM** — abstração poderosa para manipulação de banco de dados
- 🎨 **TailwindCSS** — estilização ágil e totalmente responsiva
- 🧩 **Componentes e Hooks modulares** — fácil manutenção e reuso
- 🐳 **Docker & Docker Compose** — pronto para produção e desenvolvimento
- 📁 **Banco configurado via Prisma** — veja o arquivo [`prisma/schema.prisma`](prisma/schema.prisma)

---

## 🧱 **Estrutura do Projeto**

```bash
├── app/                 # Rotas e páginas (Next.js App Router)
├── components/          # Componentes reutilizáveis
├── hooks/               # Hooks customizados
├── prisma/              # Esquema e migrações do banco de dados
├── styles/              # Estilos globais e configurações Tailwind
├── docker-compose.yml   # Configuração do ambiente Docker
└── README.md
```

---

## ⚙️ **Como Executar o Projeto**

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/lucasfrmaia/quiosque
cd quiosque
```

---

### 🐳 2️⃣ Pré-requisitos

Certifique-se de ter instalado e configurado corretamente:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

### ▶️ 3️⃣ Subir os Containers

No diretório raiz do projeto, execute:

```bash
docker-compose up --build -d
```

Esse comando irá:

- Construir a imagem do projeto;
- Criar os containers definidos no `docker-compose.yml`;
- Iniciar a aplicação e o banco de dados.

---

### 🔧 4️⃣ Inicializar o Prisma

Após os containers estarem ativos, acesse o container da aplicação **web**:

Em seguida, dentro do container, execute:

```bash
npx prisma generate
npx prisma db push
```

Depois disso, **reinicie os containers** para aplicar as alterações:

```bash
docker-compose restart
```

---

### 🔐 **Credenciais Padrão de Acesso**

Use as seguintes credenciais para entrar no sistema:

```
Usuário: admin
Senha: admin123
```
