# Demanda

Quero criar uma aplicação web chamada "Demanda", um sistema de gerenciamento de solicitações e chamados de suporte de TI.

IMPORTANTE:
- Este projeto deve usar o meu projeto Supabase existente chamado "Demanda" como backend.
- NÃO use Lovable Cloud como backend.
- NÃO crie um novo projeto Supabase.
- NÃO crie uma nova autenticação.
- NÃO crie uma nova tabela profiles.
- NÃO recrie usuários ou dados que já existem no meu Supabase.

Meu Supabase "Demanda" já possui:
- Supabase Authentication
- Usuário de teste técnico: tecnico@teste.com
- Usuário de teste solicitante: solicitante@teste.com
- Tabela profiles
- profiles.id como UUID correspondente ao UID do usuário autenticado
- profiles.nome como text
- profiles.tipo como text
- perfil técnico com tipo "tecnico"
- perfil solicitante com tipo "solicitante"
- RLS ativado
- Policy de SELECT para o próprio perfil

Nesta primeira etapa, quero apenas preparar a aplicação para utilizar esse Supabase existente e criar a interface inicial de login.

A tela de login deve ter:
- E-mail
- Senha
- Botão "Entrar"
- Design profissional, simples e responsivo.

Não implemente outras funcionalidades ainda.
Não crie demandas, chamados, dashboards ou outras páginas ainda.

Antes de gerar qualquer código que crie ou altere banco de dados, confirme que este projeto está conectado ao Supabase existente "Demanda".

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/db4248c2-68f6-4b6f-a430-476f66c1c7b0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
