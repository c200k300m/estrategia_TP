# Formato do `.md` de estratégia

Todo o conteúdo estruturado vive no **frontmatter YAML**. O corpo do arquivo (após o segundo `---`) é ignorado pelo renderizador — pode ser usado para rascunho/anotações.

Princípio central: **o renderizador deriva tudo que é calculável**. O autor escreve percentuais; valores em R$, larguras de barra, numeração de campanhas, títulos default e subtotais são calculados. Nunca escrever valores derivados à mão.

## Campos raiz (obrigatórios salvo indicação)

```yaml
cliente: Araguaia Tur
unidade: Hotéis                  # "Hotéis" | "Growth" — brand header, title e footer
cidade: São Félix do Araguaia
favicon: "🎣"                    # emoji único, estável por cliente
objetivo: reservas diretas       # vai no <em> gradiente do h1
subtitulo: Distribuição de investimento mensal entre Meta Ads e Google Ads.
footer: Arquitetura de Reservas Diretas
verba_mensal: 3000               # número, sem R$
split: { meta: 60, google: 40 }  # deve somar 100
```

Derivações: `title` da página = `Estratégia de Anúncios — {cliente} · Komplexa {unidade}`; h1 = `Plano de anúncios para <em>{objetivo}</em><br>{cliente} · {cidade}`; hero com verba e fatias Meta/Google calculadas.

## `meta_ads` (obrigatório)

```yaml
meta_ads:
  titulo: null                   # opcional; default "R$ {valor} em {n} frentes"
  sub: Crescimento, conversão e recuperação de quem já visitou.
  frentes:                       # pcts devem somar 100
    - nome: Crescimento de perfil
      pct: 20
      pendencia: "Objetivo nº 1 do onboarding: ..."   # opcional — pill de destaque
    - nome: Conversão
      pct: 60
      sub_frentes:               # opcional; pcts somam 100, R$ derivado em cascata
        - { nome: Pacotes, pct: 60 }
        - { nome: "Sempre no ar → site", pct: 40 }
    - nome: Remarketing
      pct: 20
  nota: "Geografia: ..."         # opcional, texto abaixo do card
```

## `google_ads` (obrigatório)

Mesma estrutura de `meta_ads`, com `blocos` no lugar de `frentes` (ex.: Rede de Pesquisa, PMax, Hotel Ads, Remarketing — cada um com `sub_frentes` opcionais).

## `keywords` (obrigatório)

```yaml
keywords:
  sub: As três campanhas de Pesquisa e a lista de negativas. Clique para expandir.
  campanhas:                     # numeração "1 ·", "2 ·"... é derivada da ordem
    - nome: Araguaia — Topo de Funil
      pct: 25                    # % da verba do bloco "Rede de Pesquisa"; somam 100
      aberta: true               # opcional — inicia expandida (default: só a primeira)
      desc: Captura quem pesquisa o destino...
      grupos:
        - titulo: Destino geral
          tipo: frase            # frase | exata — tipo default dos termos
          termos: [rio araguaia, vale do araguaia, "hotel boutique|exata"]
          # sufixo |exata promove um termo individual dentro de grupo frase
      obs: opcional, itálico ao final da campanha
  negativas:
    desc: Aplicar como lista compartilhada nas campanhas de Pesquisa.
    grupos:
      - { titulo: "Preço / perfil errado", termos: [barato, gratuito] }
    obs: opcional
```

A verba de cada campanha (`R$`) é derivada: `pct × verba do bloco Rede de Pesquisa`.

## Módulos opcionais (presença da chave ativa a seção)

```yaml
pacotes:
  sub: R$ 648 no Meta + R$ 252 no Google. Rodam conforme a temporada.
  slots:
    - { nome: Dia dos Pais, definido: true }
    - { nome: A definir, definido: false }
  sugestoes: [Temporada de Pesca, Réveillon no Rio]   # chips
  nota: opcional

briefing_criativos:
  sub: texto da seção
  grupos:                        # cada grupo usa cards (posts existentes) OU briefings
    - titulo: Crescimento do Perfil — posts selecionados
      sub: Alcance e crescimento da base — R$ 360
      cards:
        - { tag: Post, nome: Crescimento · Post 1, url: "https://..." }
    - titulo: Conversão — Always-on
      sub: ...
      briefings:
        - tag: Always-on         # num "Arte 01/02..." é derivado da ordem global
          conceito: Tradição que transforma pescarias em histórias
          headline: '"Há quase 30 anos criando experiências..."'
          texto: Texto de apoio do anúncio.
          destaques: [Atendimento exclusivo, Chalés confortáveis]   # opcional
          oferta: 10% OFF na reserva direta                          # opcional
          cta: Reserve Agora
  nota: opcional

aprovacao_criativos:             # v1: renderiza somente leitura (sem botões de marcar)
  sub: texto da seção
  grupos:
    - titulo: Remarketing — Prova Social
      sub: Depoimentos, selos e prêmios — R$ 1.800
      itens:
        - { tag: Post, nome: Depoimento 1, url: "https://...", sem_preview: false }

funil:
  sub: Do investimento ao faturamento, etapa por etapa.
  linhas:                        # taxa = linha recuada menor; destaque = gradiente
    - { label: Investimento, valor: R$ 15.000 }
    - { label: CPM, valor: "R$ 24,07", taxa: true }
    - { label: Faturamento, valor: R$ 331.670, destaque: true }
    - { label: ROAS, valor: 22,11x, taxa: true, positivo: true }
  nota: opcional

callout:                         # normalmente acompanha o funil
  frase: A gente não mede vaidade. Medimos negócio.
  grande: R$ 15 mil investidos → **R$ 331 mil** em vendas   # **x** vira gradiente
```

## Validação (bloqueia publicação)

- `split`, `frentes`, `blocos` e `sub_frentes`: pcts devem somar 100 (tolerância ±0,5).
- `keywords.campanhas`: pcts podem somar **até** 100 (sub-frentes da Pesquisa sem campanha de keywords, como Google Hotel Ads, não entram); acima de 100 é erro.
- Campos raiz obrigatórios presentes; `unidade` ∈ {Hotéis, Growth}; `tipo` ∈ {frase, exata}.
- `keywords` exige bloco chamado "Rede de Pesquisa" em `google_ads.blocos` (base do cálculo de verba).
- Chaves desconhecidas no frontmatter → erro (pega typo de nome de módulo).
- Strings com `: ` ou iniciadas por caractere especial devem estar entre aspas (erro de parse YAML é reportado com linha).

## Ordem das seções na página

Brand → Hero → Meta Ads → Google Ads → Keywords → Pacotes → Briefing/Aprovação de criativos → Funil → Callout → Footer. Módulos ausentes são pulados sem deixar buraco.
