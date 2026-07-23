# Plano — Ferramenta de Estratégias Komplexa (v1)

Escopo 100% fechado em 2026-07-23. Execução por fases, cada uma com critério de pronto.

## Decisões fechadas

| Tema | Decisão |
|---|---|
| Pipeline | Supabase + painel `/admin` de colar o `.md`; front estático no GitHub Pages |
| Repo | Público (`estrategia-index`), só código do app — nenhuma estratégia real no repo |
| Pasta local | `C:\dev\estrategia-index` (sai do OneDrive) |
| Acesso do cliente | Link secreto `/e/{slug}`, slug = `{cliente-kebab}-{4 chars aleatórios}` |
| Formato | `.md` com frontmatter YAML estruturado; renderização determinística |
| Stack | Vite + TypeScript, sem framework pesado; template string + `template.css` existente |
| Admin auth | Um usuário (e-mail + senha) no Supabase Auth; time depois |
| Aprovação de criativos | Módulo renderiza somente-leitura na v1; gravação no Supabase é pós-v1 |
| Histórico | Cada publicação salva a versão anterior em `estrategia_versoes`; republicar mantém o slug/link |
| PDF | Impressão do navegador (CSS de impressão já existe no template) |
| Rotas | URLs limpas `/e/{slug}` com fallback `404.html` do Pages |
| Domínio | `*.github.io` na v1; domínio próprio é troca de CNAME depois, sem retrabalho |
| Dados sensíveis | As 3 estratégias reais ficam locais em `fixtures/` (git-ignorada); o repo tem uma fixture fictícia "Hotel Exemplo" para testes |

## Pós-v1 (explicitamente fora de escopo agora)

- Aprovação de criativos gravando no Supabase + consulta no admin
- Publicação direta pelo Claude via API do Supabase (sem colar no admin)
- Domínio próprio
- Multiusuário no admin

## Fases

### Fase 0 — Fundação
1. Criar `C:\dev\estrategia-index` e mover o projeto (HTMLs, PDF, `.claude/`, docs).
2. `git init` + `.gitignore` (`node_modules`, `fixtures/reais/`, `.env*`).
3. Repo público no GitHub via `gh` + primeiro push.

**Pronto quando:** repo no ar com CLAUDE.md, PLANO.md, skill e assets; fixtures reais locais e fora do git.

### Fase 1 — Schema do `.md` + conversões
1. Definir o schema completo do frontmatter em `docs/formato-estrategia.md`: núcleo (cliente, unidade, cidade, favicon, verba, splits, frentes Meta, campanhas Google, keywords, negativas) + módulos (`pacotes`, `briefing_criativos`, `aprovacao_criativos`, `funil`, `callout`).
2. Converter as 3 estratégias reais para `.md` (fixtures locais) — juntas elas cobrem todos os módulos:
   - Vasconcelos: núcleo puro
   - Araguaia: pacotes/slots + briefing de criativos
   - Bahia Bonita: aprovação (read-only) + funil + callout + proteção de marca
3. Criar a fixture fictícia `hotel-exemplo.md` (commitável) exercitando todos os módulos de uma vez.
4. Atualizar a skill `estrategia-index` para gerar `.md` nesse formato (em vez de HTML direto).

**Pronto quando:** os 4 `.md` validam contra o schema e a skill descreve o novo fluxo.

### Fase 2 — Renderizador + página do cliente
1. Scaffold Vite + TS; portar `template.css`, fontes embutidas e logo para `src/`.
2. Parser do frontmatter + validador com mensagens apontando campo/valor (percentuais que não somam 100 bloqueiam).
3. Renderizador determinístico: todos os valores derivados (R$, larguras de barra, numeração, subtotais, contagens no texto) calculados dos percentuais.
4. Rota `/e/{slug}` + modo dev que renderiza `.md` local sem Supabase.
5. Validação visual lado a lado contra os 3 HTMLs de referência.

**Pronto quando:** as 3 fixtures reais renderizadas são visualmente indistinguíveis dos HTMLs artesanais.

### Fase 3 — Supabase
1. Você cria a conta/projeto no Supabase (eu forneço o passo a passo e o SQL pronto).
2. SQL: tabelas `estrategias` e `estrategia_versoes`; leitura anônima **só** via RPC `get_estrategia(slug)` (retorna no máximo 1 registro; sem select direto, sem listagem); escrita autenticada.
3. Criar seu usuário admin (e-mail + senha).
4. Conectar o front (URL + anon key — públicas por natureza, podem ir no código).

**Pronto quando:** `/e/{slug}` renderiza uma estratégia salva no banco.

### Fase 4 — Painel `/admin`
1. Login e-mail + senha.
2. Lista das estratégias (autenticado) com link secreto de cada uma.
3. Nova/editar: textarea de colar + validação + preview idêntico à página do cliente + publicar → devolve o link. Republicar mantém o slug e arquiva a versão anterior.

**Pronto quando:** o fluxo "colar → validar → prever → publicar → link" funciona de ponta a ponta.

### Fase 5 — Deploy + migração
1. GitHub Action de build → Pages (só quando o código muda).
2. Publicar as 3 estratégias reais pela ferramenta e conferir os links.
3. Atualizar CLAUDE.md com os comandos reais (dev, build, deploy, SQL).

**Pronto quando:** os 3 clientes têm link novo servido pelo Pages + Supabase, e o fluxo completo (criar `.md` com o Claude → colar → link) foi executado uma vez de verdade.

## O que preciso de você durante a execução

- Fase 0: estar logado no `gh` (GitHub CLI) — ou me avisar para te passar os comandos de login.
- Fase 3: criar a conta/projeto Supabase e me passar URL + anon key (te guio na hora).
- Fase 5: conferir os links finais antes de enviar aos clientes.
