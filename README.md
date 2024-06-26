# Módulo 3 - Implementando SOLID (Ignite) by Rocketseat
- GymPass Style App;

## Setup
- Clone o repositório;
- Instalar dependências (`npm install`);
- Copie o arquivo `.env.example` (`cp .env.example .env`);
- Configurar PostgreSQL (`docker compose up -d`);
- Executar aplicação (`npm run start:dev`);
- Teste! (Eu pessoalmente recomendo testar com [Hoppscotch](https://hoppscotch.io/) ou [Bruno API Client](https://www.usebruno.com/));

## Documentação da API (Swagger)
Para documentação da API, acesse o link: http://localhost:3333/docs

## Requisitos
### Requisitos funcionais
- Deve ser possível se cadastrar;
- Deve ser possível se autenticar;
- Deve ser possível obter o perfil de um usuário logado;
- Deve ser possível obter o número de check-ins realizados pelo usuário logado;
- Deve ser possível o usuário obter seu histórico de check-ins;
- Deve ser possível o usuário buscar academias próximas (10km);
- Deve ser possível o usuário buscar academias pelo nome;
- Deve ser possível o usuário realizar check-in em uma academia;
- Deve ser possível validar o check-in de um usuário;
- Deve ser possível cadastrar uma academia;

### Regras de negócio
- O usuário não deve poder se cadastrar com um e-mail duplicado;
- O usuário não pode fazer 2 check-ins no mesmo dia;
- O usuário não pode fazer check-in se não estiver perto (100m) da academia;
- O check-in só pode ser validado até 20 minutos após criado;
- O check-in só pode ser validado por administradores;
- A academia só pode ser cadastrada por administradores;

### Requisitos não-funcionais
- A senha do usuário precisa estar criptografada;
- Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- Todas listas de dados precisam estar paginas com 20 items por página;
- O usuário deve ser identificado por um JWT (JSON Web Token);
