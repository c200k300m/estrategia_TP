import type {
  Briefing, CampanhaKeywords, CardCriativo, Estrategia, Frente, GrupoKeywords, SubFrente,
} from './types'
import { LOGO_SVG } from './assets/logo'

const FEM = ['zero', 'uma', 'duas', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez', 'onze', 'doze']
const MASC = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez', 'onze', 'doze']

export function fmtBRL(n: number): string {
  return 'R$ ' + Math.round(n).toLocaleString('pt-BR')
}

function esc(s: string | number | undefined | null): string {
  return String(s ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

/** Escapa para uso dentro de um atributo, preservando quebras de linha. */
function escAttr(s: string): string {
  return esc(s).replaceAll('\n', '&#10;')
}

function numWord(n: number, fem: boolean): string {
  const tabela = fem ? FEM : MASC
  return n < tabela.length ? tabela[n] : String(n)
}

export function tituloPagina(e: Estrategia): string {
  return `Estratégia de Anúncios — ${e.cliente} · Komplexa ${e.unidade}`
}

// ─── Blocos auxiliares ───

function linhaBarra(nome: string, pct: number, verba: number, sub: boolean, pendencia?: string): string {
  return `<div class="linha${sub ? ' sub-linha' : ''}">
    <div class="topo"><span class="nome">${esc(nome)}</span><span class="num"><small>${pct}%</small>${fmtBRL(verba)}</span></div>
    <div class="bar"><i style="width:${pct}%"></i></div>
    ${pendencia ? `<div class="pendencia">${esc(pendencia)}</div>` : ''}
  </div>`
}

function cardBarras(frentes: Frente[], verbaCanal: number): string {
  const linhas = frentes.flatMap((f) => {
    const verba = (verbaCanal * f.pct) / 100
    const filhos = (f.sub_frentes ?? []).map((s: SubFrente) =>
      linhaBarra(s.nome, s.pct, (verba * s.pct) / 100, true, s.pendencia))
    return [linhaBarra(f.nome, f.pct, verba, false, f.pendencia), ...filhos]
  })
  return `<div class="card">${linhas.join('\n')}</div>`
}

function secaoCanal(
  eyebrow: string, tituloDefault: string, canal: { titulo?: string | null; sub: string; nota?: string },
  frentes: Frente[], verbaCanal: number,
): string {
  return `<section>
    <div class="eyebrow">${esc(eyebrow)}</div>
    <h2>${esc(canal.titulo || tituloDefault)}</h2>
    <p class="section-sub">${esc(canal.sub)}</p>
    ${cardBarras(frentes, verbaCanal)}
    ${canal.nota ? `<p class="nota">${esc(canal.nota)}</p>` : ''}
  </section>`
}

// ─── Keywords ───

const ICONE_COPIAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg>'

/**
 * Texto que vai para a área de transferência: um termo por linha, entre aspas.
 * Decisão do cliente: SEMPRE aspas, inclusive nos termos marcados como `exata`
 * (que no Google Ads seriam [termo]). Não trocar por colchetes.
 */
function textoParaCopiar(g: GrupoKeywords): string {
  return g.termos
    .map((t) => `"${t.endsWith('|exata') ? t.slice(0, -'|exata'.length) : t}"`)
    .join('\n')
}

function pillsGrupo(g: GrupoKeywords, tipoDefault: 'frase' | 'exata' | 'negativa'): string {
  const pills = g.termos.map((termo) => {
    let tipo: string = g.tipo ?? tipoDefault
    let texto = termo
    if (termo.endsWith('|exata')) { tipo = 'exata'; texto = termo.slice(0, -'|exata'.length) }
    return `<span class="kw-pill ${tipo}">${esc(texto)}</span>`
  })
  const copiar = `<button type="button" class="kw-copiar" data-copiar="${escAttr(textoParaCopiar(g))}"
    title="Copiar as ${g.termos.length} palavras" aria-label="Copiar as palavras de ${esc(g.titulo)}">${ICONE_COPIAR}<span class="kw-copiar-txt">copiar</span></button>`
  return `<div class="kw-grupo-head"><div class="kw-grupo-titulo">${esc(g.titulo)}</div>${copiar}</div><div class="kw-pills">${pills.join('')}</div>`
}

function campanhaKw(c: CampanhaKeywords, idx: number, verbaPesquisa: number, abertaDefault: boolean): string {
  const aberta = c.aberta ?? abertaDefault
  return `<details class="kw-camp"${aberta ? ' open' : ''}>
    <summary>
      <span class="kw-camp-nome">${idx + 1} · ${esc(c.nome)}</span>
      <span class="kw-camp-verba"><small>${c.pct}%</small>${fmtBRL((verbaPesquisa * c.pct) / 100)}<span class="seta">→</span></span>
    </summary>
    <div class="kw-corpo">
      <p class="kw-obs" style="margin-top:14px;font-style:normal">${esc(c.desc)}</p>
      ${c.grupos.map((g) => pillsGrupo(g, 'frase')).join('\n')}
      ${c.obs ? `<p class="kw-obs">${esc(c.obs)}</p>` : ''}
    </div>
  </details>`
}

function secaoKeywords(e: Estrategia, verbaPesquisa: number): string {
  const kw = e.keywords
  const negativas = `<details class="kw-camp negativas">
    <summary>
      <span class="kw-camp-nome">Negativas · lista compartilhada</span>
      <span class="kw-camp-verba">Todas as campanhas<span class="seta">→</span></span>
    </summary>
    <div class="kw-corpo">
      <p class="kw-obs" style="margin-top:14px;font-style:normal">${esc(kw.negativas.desc)}</p>
      ${kw.negativas.grupos.map((g) => pillsGrupo(g, 'negativa')).join('\n')}
      ${kw.negativas.obs ? `<p class="kw-obs">${esc(kw.negativas.obs)}</p>` : ''}
    </div>
  </details>`
  return `<section>
    <div class="eyebrow">Rede de Pesquisa</div>
    <h2>Palavras-chave das campanhas</h2>
    <p class="section-sub">${esc(kw.sub)}</p>
    <div class="kw-legenda">
      <span><span class="amostra exata">exata</span> correspondência exata</span>
      <span><span class="amostra frase">frase</span> correspondência de frase</span>
      <span>Sem correspondência ampla solta.</span>
    </div>
    ${kw.campanhas.map((c, i) => campanhaKw(c, i, verbaPesquisa, i === 0)).join('\n')}
    ${negativas}
  </section>`
}

// ─── Módulos opcionais ───

function secaoPacotes(e: Estrategia): string {
  const p = e.pacotes!
  const verbaMeta = (e.verba_mensal * e.split.meta) / 100
  const verbaGoogle = (e.verba_mensal * e.split.google) / 100
  const achar = (frentes: Frente[], canal: number): number => {
    for (const f of frentes) {
      const verbaF = (canal * f.pct) / 100
      for (const s of f.sub_frentes ?? []) {
        if (s.nome === 'Pacotes') return (verbaF * s.pct) / 100
      }
    }
    return 0
  }
  const total = achar(e.meta_ads.frentes, verbaMeta) + achar(e.google_ads.blocos, verbaGoogle)
  const titulo = `${numWord(p.slots.length, false)[0].toUpperCase()}${numWord(p.slots.length, false).slice(1)} slots${total ? ` · ${fmtBRL(total)}` : ''}`
  const slots = p.slots.map((s, i) =>
    `<div class="slot${s.definido ? ' definido' : ''}"><div class="n">${i + 1}</div><div class="label">${esc(s.nome)}</div></div>`).join('')
  return `<section>
    <div class="eyebrow">Os Pacotes</div>
    <h2>${esc(titulo)}</h2>
    <p class="section-sub">${esc(p.sub)}</p>
    <div class="slots">${slots}</div>
    ${p.sugestoes?.length ? `<div class="sugestoes-titulo">Sugestões para futuras rotações</div>
    <div class="chips">${p.sugestoes.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div>` : ''}
    ${p.nota ? `<p class="nota">${esc(p.nota)}</p>` : ''}
  </section>`
}

function embedUrl(url: string): string | null {
  const m = url.match(/instagram\.com\/(p|reel)\/([^/?]+)/)
  return m ? `https://www.instagram.com/${m[1]}/${m[2]}/embed/` : null
}

function cardLink(item: CardCriativo): string {
  const emb = item.sem_preview ? null : embedUrl(item.url)
  return `<div class="cri-card">
    <div class="cri-top"><span class="cri-tag">${esc(item.tag)}</span></div>
    <div class="cri-nome">${esc(item.nome)}</div>
    <div class="cri-links">
      <a href="${esc(item.url)}" target="_blank" rel="noopener">Abrir →</a>
      ${emb ? `<button type="button" data-preview="${esc(emb)}">Ver prévia</button>` : ''}
    </div>
    ${emb ? '<div class="cri-preview"></div>' : ''}
  </div>`
}

function cardBriefing(b: Briefing, num: string): string {
  return `<div class="brief-card">
    <div class="brief-top"><span class="cri-tag">${esc(b.tag)}</span><span class="brief-num">${esc(num)}</span></div>
    <div class="brief-conceito">${esc(b.conceito)}</div>
    <div class="brief-label">Headline</div>
    <div class="brief-headline">${esc(b.headline)}</div>
    <div class="brief-label">Texto de apoio</div>
    <p class="brief-texto">${esc(b.texto)}</p>
    ${b.destaques?.length ? `<div class="brief-label">Destaques</div>
    <div class="brief-destaques">${b.destaques.map((d) => `<span>${esc(d)}</span>`).join('')}</div>` : ''}
    ${b.oferta ? `<span class="brief-oferta">${esc(b.oferta)}</span>` : ''}
    <div class="brief-cta">${esc(b.cta)} →</div>
  </div>`
}

function secaoBriefing(e: Estrategia): string {
  const bc = e.briefing_criativos!
  let numArte = 0
  let numPacote = 0
  const grupos = bc.grupos.map((g) => {
    let corpo: string
    if (g.cards?.length) {
      corpo = `<div class="criativos-grid">${g.cards.map(cardLink).join('\n')}</div>`
    } else {
      const cards = (g.briefings ?? []).map((b) => {
        const num = b.tag === 'Pacote'
          ? `Pacote ${String(++numPacote).padStart(2, '0')}`
          : `Arte ${String(++numArte).padStart(2, '0')}`
        return cardBriefing(b, num)
      })
      corpo = `<div class="brief-grid">${cards.join('\n')}</div>`
    }
    return `<div class="cat-titulo">${esc(g.titulo)}</div><div class="cat-sub">${esc(g.sub)}</div>${corpo}`
  })
  return `<section>
    <div class="eyebrow">Criativos</div>
    <h2>Criativos selecionados e briefing de produção</h2>
    <p class="section-sub">${esc(bc.sub)}</p>
    ${grupos.join('\n')}
    ${bc.nota ? `<p class="nota">${esc(bc.nota)}</p>` : ''}
  </section>`
}

function secaoAprovacao(e: Estrategia): string {
  const ap = e.aprovacao_criativos!
  const grupos = ap.grupos.map((g) =>
    `<div class="cat-titulo">${esc(g.titulo)}</div><div class="cat-sub">${esc(g.sub)}</div>
    <div class="criativos-grid">${g.itens.map(cardLink).join('\n')}</div>`)
  return `<section>
    <div class="eyebrow">Criativos</div>
    <h2>Criativos para aprovação</h2>
    <p class="section-sub">${esc(ap.sub)}</p>
    ${grupos.join('\n')}
  </section>`
}

function secaoFunil(e: Estrategia): string {
  const f = e.funil!
  const linhas = f.linhas.map((l) => {
    const classes = ['frow']
    if (l.taxa) classes.push('taxa')
    if (l.destaque) classes.push('destaque')
    const vClasse = l.positivo ? ' class="v pos"' : ' class="v"'
    return `<div class="${classes.join(' ')}"><span class="k">${esc(l.label)}</span><span${vClasse}>${esc(l.valor)}</span></div>`
  })
  return `<section>
    <div class="eyebrow">Meta do Mês</div>
    <h2>Projeção do funil</h2>
    <p class="section-sub">${esc(f.sub)}</p>
    <div class="funil">${linhas.join('\n')}</div>
    ${f.nota ? `<p class="nota">${esc(f.nota)}</p>` : ''}
  </section>`
}

function secaoCallout(e: Estrategia): string {
  const c = e.callout!
  const grande = esc(c.grande).replace(/\*\*(.+?)\*\*/g, '<em>$1</em>')
  return `<div class="callout">
    <div class="frase">${esc(c.frase)}</div>
    <div class="grande">${grande}</div>
  </div>`
}

// ─── Página ───

export function renderBody(e: Estrategia): string {
  const verbaMeta = (e.verba_mensal * e.split.meta) / 100
  const verbaGoogle = (e.verba_mensal * e.split.google) / 100
  const pesquisa = e.google_ads.blocos.find((b) => b.nome === 'Rede de Pesquisa')
  const verbaPesquisa = pesquisa ? (verbaGoogle * pesquisa.pct) / 100 : 0

  const tituloMeta = `${fmtBRL(verbaMeta)} em ${numWord(e.meta_ads.frentes.length, true)} frentes`
  const tituloGoogle = `${fmtBRL(verbaGoogle)} em ${numWord(e.google_ads.blocos.length, false)} blocos`

  return `<div class="wrap">
  <div class="brand">${LOGO_SVG}<span>Komplexa ${esc(e.unidade)}</span></div>

  <header>
    <div class="eyebrow">Estratégia de Mídia</div>
    <h1>Plano de anúncios para <em>${esc(e.objetivo)}</em><br>${esc(e.cliente)} · ${esc(e.cidade)}</h1>
    <p class="sub">${esc(e.subtitulo)}</p>
    <div class="hero-card">
      <div class="metric"><div class="label">Investimento mensal</div><div class="num">${fmtBRL(e.verba_mensal)}</div></div>
      <div class="metric"><div class="label">Meta Ads · ${e.split.meta}%</div><div class="num">${fmtBRL(verbaMeta)}</div></div>
      <div class="metric"><div class="label">Google Ads · ${e.split.google}%</div><div class="num">${fmtBRL(verbaGoogle)}</div></div>
    </div>
  </header>

  ${secaoCanal('Meta Ads', tituloMeta, e.meta_ads, e.meta_ads.frentes, verbaMeta)}
  ${secaoCanal('Google Ads', tituloGoogle, e.google_ads, e.google_ads.blocos, verbaGoogle)}
  ${secaoKeywords(e, verbaPesquisa)}
  ${e.pacotes ? secaoPacotes(e) : ''}
  ${e.briefing_criativos ? secaoBriefing(e) : ''}
  ${e.aprovacao_criativos ? secaoAprovacao(e) : ''}
  ${e.funil ? secaoFunil(e) : ''}
  ${e.callout ? secaoCallout(e) : ''}

  <footer>Komplexa ${esc(e.unidade)} · ${esc(e.footer)}</footer>
</div>`
}

/** Liga o toggle de prévia (iframe do Instagram) nos botões [data-preview]. */
/** Copia texto com fallback para contextos sem clipboard API (file://, http). */
async function copiarTexto(texto: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(texto)
    return
  } catch {
    const ta = document.createElement('textarea')
    ta.value = texto
    ta.setAttribute('readonly', '')
    ta.style.cssText = 'position:fixed;top:-1000px;opacity:0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }
}

function feedbackCopiado(btn: HTMLElement): void {
  btn.classList.add('copiado')
  setTimeout(() => btn.classList.remove('copiado'), 1600)
}

export function attachPreviewHandlers(root: HTMLElement): void {
  root.addEventListener('click', (ev) => {
    const copiar = (ev.target as HTMLElement).closest<HTMLButtonElement>('button[data-copiar]')
    if (copiar) {
      void copiarTexto(copiar.dataset.copiar!).then(() => feedbackCopiado(copiar))
      return
    }
    const btn = (ev.target as HTMLElement).closest<HTMLButtonElement>('button[data-preview]')
    if (!btn) return
    const card = btn.closest('.cri-card')
    const pv = card?.querySelector<HTMLElement>('.cri-preview')
    if (!pv) return
    if (pv.classList.contains('aberto')) {
      pv.classList.remove('aberto')
      pv.innerHTML = ''
    } else {
      const iframe = document.createElement('iframe')
      iframe.src = btn.dataset.preview!
      iframe.loading = 'lazy'
      iframe.setAttribute('scrolling', 'no')
      pv.replaceChildren(iframe)
      pv.classList.add('aberto')
    }
  })
}

/** Monta o documento standalone completo (usado pelo modo dev / render CLI). */
export function renderPaginaCompleta(e: Estrategia, css: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(tituloPagina(e))}</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${encodeURIComponent(e.favicon)}</text></svg>">
<style>${css}</style>
</head>
<body>
${renderBody(e)}
<script>
document.addEventListener('click', function (ev) {
  var cp = ev.target.closest ? ev.target.closest('button[data-copiar]') : null
  if (cp) {
    var texto = cp.getAttribute('data-copiar')
    var marcar = function () {
      cp.classList.add('copiado')
      setTimeout(function () { cp.classList.remove('copiado') }, 1600)
    }
    var manual = function () {
      var ta = document.createElement('textarea')
      ta.value = texto
      ta.setAttribute('readonly', '')
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0'
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy') } catch (e) {}
      ta.parentNode.removeChild(ta)
      marcar()
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(marcar, manual)
    } else manual()
    return
  }
  var btn = ev.target.closest ? ev.target.closest('button[data-preview]') : null
  if (!btn) return
  var card = btn.closest('.cri-card')
  var pv = card && card.querySelector('.cri-preview')
  if (!pv) return
  if (pv.classList.contains('aberto')) { pv.classList.remove('aberto'); pv.innerHTML = '' }
  else {
    pv.innerHTML = '<iframe src="' + btn.getAttribute('data-preview') + '" loading="lazy" scrolling="no"></iframe>'
    pv.classList.add('aberto')
  }
})
</script>
</body>
</html>
`
}
