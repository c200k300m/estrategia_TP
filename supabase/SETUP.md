# Setup do Supabase (Fase 3 — passo a passo)

1. Criar conta/projeto em https://supabase.com (plano Free, região `sa-east-1` São Paulo).
2. No **SQL Editor**, colar e executar o conteúdo de `schema.sql`.
3. Em **Authentication → Users → Add user**: criar o usuário admin (seu e-mail + senha). Marcar "Auto confirm user".
4. Em **Authentication → Sign In / Up**: desabilitar "Allow new users to sign up" (só o admin criado acessa).
5. Em **Project Settings → API**, copiar:
   - `Project URL` → `SUPABASE_URL` em `src/config.ts`
   - `anon public` key → `SUPABASE_ANON_KEY` em `src/config.ts`
6. Commitar `src/config.ts` (a anon key é pública por design; a segurança está nas políticas RLS do schema).

## Modelo de segurança

- Anônimo não lê a tabela `estrategias` — só executa a RPC `get_estrategia(slug)`, que devolve no máximo 1 registro por slug exato. Sem slug, sem dados; listar é impossível.
- Escrita (criar/editar) exige sessão autenticada.
- Republicar uma estratégia arquiva a versão anterior em `estrategia_versoes` via trigger.
