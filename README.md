# Boneheal CRM

Sistema de CRM especializado para gestão de leads e vendas de barreiras ósseas, desenvolvido com React, TypeScript, Node.js e PostgreSQL.

## 🚀 Funcionalidades

### Gestão de Leads
- Pipeline visual com drag-and-drop
- Múltiplos pipelines (Hunting, Carteira, Positivação, etc.)
- Histórico completo de interações
- Cadastro de clientes com aprovação

### Vendas
- Catálogo de produtos
- Geração de orçamentos
- Cálculo automático de frete
- Múltiplas formas de pagamento
- Descontos por valor/percentual
- PDF de orçamentos personalizados

### Agenda
- Calendário de eventos
- Agendamento de visitas
- Lembretes automáticos
- Visualização por dia/semana/mês

### Relatórios
- Dashboard interativo
- Métricas de vendas
- Análise de pipeline
- Performance por produto
- Distribuição geográfica

### Configurações
- Gestão de usuários e permissões
- Configuração de produtos
- Zonas de frete
- Formas de pagamento
- Regras de desconto

## 🛠️ Tecnologias

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Zustand (Gerenciamento de estado)
- React Router DOM
- DND Kit (Drag and Drop)
- Chart.js
- Lucide Icons
- React Hot Toast

### Backend
- Node.js
- Fastify
- PostgreSQL
- JWT Authentication
- Zod (Validação)
- Bcrypt (Criptografia)

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- pnpm (recomendado) ou npm

### Configuração do Banco de Dados
1. Crie um banco de dados PostgreSQL:
```sql
CREATE DATABASE boneheal;
```

2. Execute as migrações:
```bash
pnpm migrate
```

### Instalação do Projeto
1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/boneheal-crm.git
cd boneheal-crm
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo .env com suas configurações:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/boneheal
JWT_SECRET=seu-secret-key-aqui
```

5. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```

## 🗄️ Estrutura do Banco de Dados

### Principais Tabelas
- `users`: Usuários do sistema
- `leads`: Leads e clientes
- `events`: Eventos e compromissos
- `products`: Produtos
- `quotes`: Orçamentos
- `shipping_zones`: Zonas de frete
- `payment_methods`: Formas de pagamento

### Relacionamentos
- Leads → Usuários (responsável)
- Eventos → Leads
- Orçamentos → Leads
- Orçamentos → Produtos
- Orçamentos → Formas de pagamento

## 👥 Níveis de Acesso

### Admin
- Acesso total ao sistema
- Gestão de usuários
- Configurações gerais

### Gerente
- Visualização de todos os leads
- Aprovação de cadastros
- Relatórios gerenciais

### Usuário
- Gestão dos próprios leads
- Geração de orçamentos
- Agenda pessoal

## 📝 Regras de Negócio

### Cadastro de Clientes
1. Lead é criado no sistema
2. Dados básicos são preenchidos
3. Solicitação de cadastro é enviada
4. Gerente/Admin aprova ou rejeita
5. Se aprovado, define limite de crédito

### Orçamentos
1. Cliente deve estar cadastrado
2. Cálculo automático de frete por CEP
3. Desconto limitado por forma de pagamento
4. Geração automática de número sequencial
5. PDF personalizado com logo

## 🔒 Segurança

- Autenticação JWT
- Senhas hasheadas com bcrypt
- Row Level Security no PostgreSQL
- Validação de dados com Zod
- CORS configurado
- Rate limiting

## 📊 Monitoramento

- Logs estruturados
- Métricas de performance
- Rastreamento de erros
- Auditoria de ações importantes

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📧 Suporte

Para suporte, envie um email para suporte@boneheal.com.br

## 🙏 Agradecimentos

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Fastify](https://www.fastify.io/)
- [Lucide Icons](https://lucide.dev/)

---
Desenvolvido com ❤️ por [Boneheal](https://boneheal.com.br)