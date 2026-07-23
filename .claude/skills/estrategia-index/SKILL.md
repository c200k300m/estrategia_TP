---
name: estrategia-index
description: Cria o documento "index" de estratégia de mídia da Komplexa para um cliente (padrão Araguaia Tur/Vasconcelos) a partir do formulário de onboarding, e publica como artifact. Usar quando o usuário pedir uma estratégia/index novo para um cliente, ou ajustes em um já publicado.
---

# Processo: Documento Index de Estratégia de Mídia (Komplexa)

Este é o processo para criar a página de estratégia de anúncios entregue aos clientes da Komplexa — o "index". A referência canônica de estrutura e visual é `estrategia-araguaia-tur.html` na raiz do projeto. Os assets desta skill (`template.css`, `logo-komplexa.svg`, `fonts-inline.css`) são cópias estáveis extraídas dela.

## 1. Insumos — o que extrair do onboarding

Antes de escrever qualquer coisa, extrair do formulário de onboarding (ou perguntar ao usuário o que faltar):

| Insumo | Para quê |
|---|---|
| Verba mensal de tráfego | Toda a matemática do documento |
| Produtos/serviços e ticket de cada um | Pesos da verba de conversão |
| Qual produto é o foco (motor de faturamento) | Maior fatia de conversão |
| Público de cada produto (idade, gênero, classe) | Notas de segmentação e tom dos criativos |
| Região de atuação + região histórica de vendas | Geografia das campanhas |
| Objeções mapeadas | Estratégia de remarketing |
| Jornada de compra (canal de conversão: WhatsApp? site?) | CTA de todos os anúncios |
| Diferenciais e história do fundador | Copy dos criativos institucionais |
| Restrições do setor (ética médica/odonto, sazonalidade legal como piracema) | Conformidade — ver §5 |
| O que já funcionou (rádio, indicação, panfleto) | Justifica proteção de marca e prova social |
| Metas de faturamento | Callout final e funil de metas |

Se a verba ou o produto-foco não estiverem claros, **perguntar antes de criar** — o resto pode ser inferido e marcado como premissa.

## 2. Lógica de distribuição de verba

Princípio geral: **a verba segue o ticket e o estágio de decisão**. Meta cria demanda, Google captura demanda, remarketing segura a decisão.

### Divisão macro (default: 60% Meta / 40% Google)
- Meta maior porque criar demanda é o que cresce além do teto finito da pesquisa local.
- Ajustar só com motivo declarado no documento (ex.: categoria sem volume de busca → mais Meta; demanda de pesquisa fortíssima → aproximar de 50/50).

### Meta Ads — três frentes fixas
- **Crescimento de perfil · ~20%** — alcance e reconhecimento; barateia a conversão e alimenta remarketing/lookalike.
- **Conversão · ~60%** — subdividida por produto com peso proporcional ao ticket/potencial de faturamento. O produto high ticket leva a maior parte (ex.: 70/30, 60/40).
- **Remarketing · ~20%** — responde às objeções mapeadas ("vou pensar", "vou falar com a família"). Prova social, bastidores, "como funciona a primeira visita".

### Google Ads — Pesquisa em camadas de intenção
Com verba pequena (≲ R$ 2.000 no Google), **100% em Rede de Pesquisa** — pulverizar com PMax é queimar verba; declarar isso no documento. Camadas, com verba crescendo conforme a proximidade do dinheiro:
1. **Proteção de marca** (só se o nome já é buscado — indicações, rádio, mídia offline) · ~10%
2. **Topo de funil da categoria** (destino, "dentista perto de mim") · 10–25% — CPC baixo, alimenta remarketing
3. **Intenção qualificada por produto** · maior fatia — um grupo de anúncios por tema
4. **Pacotes/ofertas sazonais** (se existirem) · conforme slots

Regras fixas de pesquisa:
- Correspondência **frase e exata; nunca ampla solta** (a legenda do documento afirma isso).
- **Lista de negativas compartilhada**: preço-caçador/perfil errado, ruído informacional, emprego/educação, compra de equipamentos ou imóveis, outros destinos, automedicação — adaptar ao nicho.
- **Concorrentes como negativas, sem conquesting** (decisão padrão da casa).
- Exceções cirúrgicas viram `obs` na campanha (ex.: "como chegar" ativo só no topo de funil, negativado nas demais).

### Vertical Hotéis (Komplexa Hotéis) — regras específicas

Para hotéis, as regras abaixo **substituem** os defaults genéricos acima.

**Divisão macro — depende do tipo de hotel:**
| Tipo | Meta Ads | Google Ads | Lógica |
|---|---|---|---|
| Hotel turístico (lazer, destino) | ~60% | ~40% | A viagem nasce do desejo — Meta cria a demanda |
| Hotel comercial (negócios, trânsito) | ~40% | ~60% | A hospedagem nasce da necessidade — Google captura a busca |

**Meta Ads (hotéis):**
- **Crescimento · ~25%**
- **Conversão · ~50%** — subdividida em **Always-on 60% / Pacotes 40%**
- **Remarketing · ~25%**

**Google Ads (hotéis) — estrutura por degrau de verba do Google:**

| Verba Google | Pesquisa | PMax | Hotel Ads | Remarketing |
|---|---|---|---|---|
| A partir de R$ 800 | 80% | 20% | — | — |
| A partir de R$ 1.200 | 60% | 20% | 20% | — |
| A partir de R$ 2.000 | 50% | 20% | 15% | 15% |

Divisão interna da Pesquisa por degrau:
| Verba Google | Topo de funil da categoria | Intenção qualificada | Ofertas/pacotes sazonais |
|---|---|---|---|
| A partir de R$ 800 | 25% | 50% | 25% |
| A partir de R$ 1.200+ | 20% | 60% | 20% |

Proteção de marca entra dentro da Pesquisa quando o hotel já é buscado pelo nome (OTAs comprando o nome = urgência), saindo da fatia de intenção qualificada.

## 3. Estrutura do documento

### Núcleo (sempre presente)
1. **Brand header** — logo Komplexa (`logo-komplexa.svg`) + nome da unidade ("Komplexa Hotéis" para hotelaria, "Komplexa Growth" para os demais).
2. **Header/hero** — eyebrow "Estratégia de Mídia"; h1 "Plano de anúncios para *<objetivo>* — Cliente · Cidade" (o `<em>` recebe o gradiente); sub de uma linha com o posicionamento; `hero-card` com 3 métricas: Investimento mensal / Meta Ads X% / Google Ads Y%.
3. **Seção Meta Ads** — card de barras (`linha`/`sub-linha`) com as três frentes e subdivisões. `pendencia` para próximos passos; `nota` final com geografia e públicos.
4. **Seção Google Ads** — card de barras com as camadas de Pesquisa.
5. **Seção Palavras-chave** — legenda exata/frase + `<div id="kw-container">` renderizado pelo script `KEYWORDS` (array com nome, pct, verba, desc, grupos{t, tipo, kws[]}, obs; sufixo `|exata` numa kw de grupo frase promove só ela). Última entrada: negativas (`negativas:true`).
6. **Footer** — "Komplexa <Unidade> · <assinatura>" (ex.: "Arquitetura de Reservas Diretas", "Arquitetura de Crescimento").

### Módulos opcionais (ligar conforme o cliente)
- **Pacotes/slots** (`slots` + `chips`) — quando há ofertas sazonais rotativas. Slots definidos ganham classe `definido`; sugestões futuras viram chips.
- **Briefing de criativos** (`brief-grid`/`brief-card`) — quando as artes ainda serão produzidas: conceito, headline entre aspas, texto de apoio, destaques (chips), CTA. Agrupar por frente (Institucional/Crescimento, Conversão por produto, Remarketing).
- **Criativos para aprovação** (padrão Bahia Bonita) — quando há posts existentes a aprovar: cards com link "Abrir →", prévia embed, botões Aprovar/Ajustar e resumo copiável. Só na versão local — embeds não carregam no artifact (CSP).
- **Funil de metas** (`funil`/`frow`) — investimento → conversas → agendamentos → fechamentos → faturamento → ROAS. Sempre rotular como premissas a recalibrar com dados reais. **Não incluir se o cliente não quiser projeções.**
- **Callout final** — a frase de fechamento amarrando investimento à meta do cliente. Depende do funil; se o funil sai, ele sai junto.

## 4. Identidade visual

- CSS completo em `template.css` (mesma folha do Araguaia — já inclui funil, callout, slots, briefing, aprovação e estilos de impressão). **Não redesenhar; reutilizar.**
- Paleta: navy `#0D1A2D`/`#14233C`, azul `#00C6FF`, gradiente `#1670C3→#1099E9→#24D5FF`. Fundo padrão: navy escuro (padrão Araguaia) com cards brancos.
- Fontes: Exo 2 (display) + Work Sans (corpo). Versão local usa `<link>` do Google Fonts; versão artifact usa `fonts-inline.css` (data URIs).
- Título da página: `Estratégia de Anúncios — <Cliente> · Komplexa <Unidade>`.

## 5. Conformidade por nicho (embutida, não remendada)

- **Saúde/odontologia**: Código de Ética veda anunciar preço, gratuidade e forma de pagamento. Nenhum criativo/anúncio menciona valores; taxa de avaliação só no atendimento. Declarar isso no documento.
- **Pesca/turismo de natureza**: piracema/defeso — prever pausa das campanhas de pesca e migração de verba (ecoturismo/família) na `obs` das negativas.
- Sem promoções quando o cliente não trabalha com elas — a oferta vira diferencial (ex.: "10% OFF na reserva direta" só se existir e for permitido).

## 6. Copy — regras de escrita

- Tudo em pt-BR, tom direto e comercial; números sempre em R$ com separador de milhar.
- Cada seção: eyebrow curto + h2 com o número principal ("R$ 1.800 em três frentes") + `section-sub` de uma linha explicando a decisão.
- Decisões estratégicas ganham justificativa de uma frase no próprio documento (ex.: por que sem PMax).
- Dados do onboarding aparecem refletidos no texto (objetivo nº 1, objeções, região histórica) — o cliente precisa se reconhecer no documento.
- Headlines de criativos entre aspas; CTAs terminam com "→".

## 7. Montagem técnica e publicação

Manter **duas versões** sincronizadas a cada mudança:

1. **Body** — escrever/editar o miolo (conteúdo de `<body>`) num arquivo de trabalho no scratchpad.
2. **Arquivo do projeto** — `estrategia-<cliente>.html` na raiz: DOCTYPE + head com `<link>` Google Fonts + `template.css` + body.
3. **Arquivo do artifact** — `<title>` + `<style>` com `fonts-inline.css` + `template.css` + body, **sem** DOCTYPE/html/head/body (o artifact envolve sozinho).
4. **Publicar** com o tool Artifact: favicon emoji fixo por cliente (🎣 pesca, 🏝️ praia, 🦷 odonto...), description de uma frase, `label` curto descrevendo a versão. **Republicar sempre no mesmo file_path para manter a URL.**

Montagem via script (ajustar nomes):

```python
import re, pathlib
src = pathlib.Path(r"<raiz do projeto>")
style = pathlib.Path("<skill>/template.css").read_text(encoding="utf-8")
fonts = pathlib.Path("<skill>/fonts-inline.css").read_text(encoding="utf-8")
body  = pathlib.Path("<scratchpad>/cliente-body.html").read_text(encoding="utf-8")
title = "Estratégia de Anúncios — <Cliente> · Komplexa <Unidade>"
projeto = ("<!DOCTYPE html>\n<html lang=\"pt-BR\">\n<head>\n<meta charset=\"UTF-8\">\n"
  "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n"
  f"<title>{title}</title>\n"
  "<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n"
  "<link href=\"https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800&family=Work+Sans:wght@400;500;600;700&display=swap\" rel=\"stylesheet\">\n"
  f"<style>{style}</style>\n</head>\n<body>\n{body}\n</body>\n</html>\n")
(src / "estrategia-<cliente>.html").write_text(projeto, encoding="utf-8")
artifact = f"<title>{title}</title>\n<style>\n{fonts}\n{style}\n</style>\n{body}"
pathlib.Path("<scratchpad>/artifact-<cliente>.html").write_text(artifact, encoding="utf-8")
```

Limitações do artifact a avisar quando relevante: embeds externos (Instagram etc.) não carregam (CSP); links normais funcionam.

## 8. Iteração — quando o usuário pedir mudanças

Pedidos tipo "tira X", "muda o percentual de Y":
1. Editar o body de trabalho (recalcular **todos** os valores derivados: R$, %, larguras das barras, numeração das campanhas, contagens no texto como "as três campanhas", subtotais citados em outras seções).
2. Caçar referências pendentes — texto que apontava para a seção removida ("briefing abaixo") precisa ser ajustado.
3. Reconstruir as duas versões e republicar no mesmo file_path (mesma URL).
4. Responder com o link e um resumo curto do que mudou (tabela antes/agora quando for redistribuição de verba).
