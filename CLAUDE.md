# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## O que é este projeto

Ferramenta da Komplexa para publicar "index" de estratégia de mídia para clientes. O fluxo-alvo:

1. O usuário cria a estratégia em `.md` com o Claude (processo em `.claude/skills/estrategia-index/SKILL.md`).
2. Cola o `.md` no painel `/admin` da ferramenta (ou o Claude publica direto via API do Supabase).
3. A ferramenta valida, salva no Supabase e gera um link secreto.
4. O cliente acessa a página renderizada no visual Komplexa (padrão dos HTMLs `estrategia-*.html`).

**Estado atual: app construído (Fases 0–4 do PLANO.md).** Pendências que dependem do usuário: login no `gh` (criar repo público + push + habilitar Pages) e criação do projeto Supabase (`supabase/SETUP.md`) com preenchimento de `src/config.ts`. Depois disso: publicar as 3 estratégias reais pelo admin (Fase 5).

**Dados sensíveis:** o repo é público. Estratégias reais de clientes (HTMLs e `.md` com verbas/keywords) NUNCA vão para o git — vivem em `fixtures/reais/` (git-ignorada) e no Supabase. A única fixture commitável é a fictícia `hotel-exemplo.md`.

## Arquitetura decidida

- **Front**: SPA estática no GitHub Pages. Stack pretendida: Vite + TypeScript, sem framework pesado — a renderização é template string determinística (o design já existe pronto em CSS).
  - `/e/{slug}` — página do cliente: busca a estratégia no Supabase pelo slug e renderiza.
  - `/admin` — login Supabase + textarea de colar o `.md` + validação com erros claros + botão publicar que devolve o link.
- **Supabase** (plano free):
  - Tabela `estrategias`: `id`, `slug` (secreto, não-adivinhável, ex. `vasconcelos-x7k2`), `cliente`, `md_source`, `created_at`, `updated_at`. Histórico de versões em tabela separada se necessário.
  - RLS: leitura anônima **apenas** via RPC `get_estrategia(slug)` que retorna no máximo 1 registro — sem select direto na tabela, nunca listagem; escrita apenas autenticada. Histórico em `estrategia_versoes`; republicar mantém o slug.
  - O slug é a proteção — não criar endpoint público que liste estratégias.
- **Sem build por conteúdo**: publicar estratégia não passa por git. O deploy do Pages (GitHub Action) acontece só quando o código do app muda.

## Formato do `.md` de estratégia

Frontmatter YAML com os dados estruturados + seções de texto. O renderizador calcula tudo que é derivado (valores em R$, larguras de barras, numeração de campanhas, subtotais) a partir dos percentuais — nunca confiar em números redigidos à mão no texto. Esboço do contrato (refinar na implementação e documentar o schema final aqui):

```yaml
cliente: Vasconcelos Odontologia
unidade: Growth            # Growth | Hotéis — define brand header e assinatura do footer
cidade: São José dos Campos
favicon: 🦷
verba_mensal: 3000
split: { meta: 60, google: 40 }
meta:
  frentes:                 # crescimento/conversão/remarketing, com sub-frentes aninhadas
  notas: ...
google:
  campanhas:               # nome, pct, camada, grupos de keywords {titulo, tipo: frase|exata, termos[]}
  negativas:               # grupos compartilhados
modulos: [keywords]        # opcionais: pacotes, briefing_criativos, aprovacao_criativos, funil, callout
```

Validação no admin antes de salvar: percentuais que não somam 100, campos obrigatórios ausentes e módulos desconhecidos devem bloquear a publicação com mensagem apontando a linha/campo.

## Design system (não redesenhar)

- CSS canônico: `.claude/skills/estrategia-index/template.css` (cobre todas as seções e módulos, incluindo impressão/PDF). Logo em `logo-komplexa.svg`; fontes Exo 2 + Work Sans em `fonts-inline.css` (embutir — não depender de CDN).
- Os HTMLs `estrategia-*.html` na raiz são as referências douradas do resultado visual: qualquer renderizador novo deve produzir uma página indistinguível delas. Não editar esses arquivos como parte do app; são fixtures.
- Paleta: navy `#0D1A2D`/`#14233C`, azul `#00C6FF`, gradiente `#1670C3→#1099E9→#24D5FF`. Fundo navy escuro com cards brancos (padrão Araguaia).

## Lógica de negócio

Toda a lógica de distribuição de verba (60/40 default, frentes do Meta, camadas de Pesquisa do Google, degraus por verba na vertical hotéis, regras de keywords/negativas, conformidade por nicho) está em `.claude/skills/estrategia-index/SKILL.md`. A skill é o processo de **autoria** do `.md`; o app é só **renderização e publicação** — não duplicar regras de negócio no código do app além da validação estrutural.

## Comandos

- `npm run dev` — dev server (rotas: `/`, `/admin`, `/e/{slug}`)
- `npm run build` — type-check (`tsc --noEmit`) + build Vite em `dist/`
- `npm run render -- fixtures/reais/<arquivo>.md [saida.html]` — valida e renderiza um `.md` para HTML standalone (modo dev/CLI, sem Supabase; saída default em `fixtures/out/`)
- Deploy: push na `main` dispara `.github/workflows/deploy.yml` (build com `BASE_PATH=/estrategia-index/`, copia `index.html`→`404.html` para fallback SPA, publica no Pages)
- Supabase: rodar `supabase/schema.sql` no SQL Editor uma única vez (passo a passo em `supabase/SETUP.md`); credenciais públicas em `src/config.ts`

## Estrutura do código

- `src/parser.ts` → extrai/parseia frontmatter · `src/validate.ts` → regras de validação (percentuais somam 100 etc.) · `src/render.ts` → renderização determinística (deriva R$, barras, numeração) · `src/view.ts` → parse+valida+renderiza num container · `src/main.ts` → router · `src/admin.ts` → painel de colar/publicar · `src/supabase.ts` → client + RPC pública
- `src/styles/template.css` e `src/assets/logo.ts` são **gerados** dos assets canônicos em `.claude/skills/estrategia-index/` — mudanças de design começam lá e são copiadas para `src/`
- Testes de regressão: `npm run render` nas 4 fixtures deve passar; os valores derivados devem bater com os HTMLs artesanais de `fixtures/reais/`
