# DC Transportes API

API REST versionada para os formulários do site e gestão administrativa das solicitações.

## Executar

```bash
copy .env.example .env
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

`db:seed` insere solicitações fictícias para demonstração e não duplica dados se o banco já tiver registros.

Edite `DATABASE_URL` no `.env` com os dados do SQL Server antes de executar `npm run db:push`.

Documentação: `http://localhost:3333/docs`  
Health check: `http://localhost:3333/health`

Rotas públicas:

- `POST /api/v1/contact`
- `POST /api/v1/applications/resume`
- `POST /api/v1/applications/aggregate`

Rotas administrativas usam `Authorization: Bearer <token>` após `POST /api/v1/admin/login`.
