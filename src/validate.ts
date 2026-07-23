import type { Estrategia, Frente } from './types'

const CAMPOS_RAIZ = [
  'cliente', 'unidade', 'cidade', 'favicon', 'objetivo', 'subtitulo',
  'footer', 'verba_mensal', 'split', 'meta_ads', 'google_ads', 'keywords',
] as const

const MODULOS = ['pacotes', 'briefing_criativos', 'aprovacao_criativos', 'funil', 'callout'] as const

const TOLERANCIA = 0.5

function somaPct(itens: { pct: number }[]): number {
  return itens.reduce((s, i) => s + (typeof i.pct === 'number' ? i.pct : NaN), 0)
}

/** Valida a estratégia; retorna a lista de erros (vazia = válida). */
export function validarEstrategia(e: Estrategia): string[] {
  const erros: string[] = []
  const raw = e as unknown as Record<string, unknown>

  for (const campo of CAMPOS_RAIZ) {
    if (raw[campo] === undefined || raw[campo] === null) erros.push(`Campo obrigatório ausente: "${campo}"`)
  }
  if (erros.length) return erros // sem os campos base não dá para validar o resto

  const conhecidas = new Set<string>([...CAMPOS_RAIZ, ...MODULOS])
  for (const chave of Object.keys(raw)) {
    if (!conhecidas.has(chave)) erros.push(`Chave desconhecida no frontmatter: "${chave}" (typo?)`)
  }

  if (e.unidade !== 'Hotéis' && e.unidade !== 'Growth') {
    erros.push(`"unidade" deve ser "Hotéis" ou "Growth" (recebido: "${e.unidade}")`)
  }
  if (typeof e.verba_mensal !== 'number' || e.verba_mensal <= 0) {
    erros.push('"verba_mensal" deve ser um número positivo (sem R$, sem pontos)')
  }

  const splitSoma = (e.split?.meta ?? NaN) + (e.split?.google ?? NaN)
  if (Math.abs(splitSoma - 100) > TOLERANCIA) {
    erros.push(`"split" deve somar 100 (meta + google = ${splitSoma})`)
  }

  const checarFrentes = (itens: Frente[] | undefined, caminho: string) => {
    if (!itens?.length) { erros.push(`"${caminho}" precisa de pelo menos um item`); return }
    const soma = somaPct(itens)
    if (Math.abs(soma - 100) > TOLERANCIA) erros.push(`"${caminho}" deve somar 100 (soma atual: ${soma})`)
    for (const f of itens) {
      if (!f.nome) erros.push(`Item sem "nome" em "${caminho}"`)
      if (f.sub_frentes?.length) {
        const s = somaPct(f.sub_frentes)
        if (Math.abs(s - 100) > TOLERANCIA) {
          erros.push(`Sub-frentes de "${f.nome}" devem somar 100 (soma atual: ${s})`)
        }
      }
    }
  }
  checarFrentes(e.meta_ads?.frentes, 'meta_ads.frentes')
  checarFrentes(e.google_ads?.blocos, 'google_ads.blocos')

  const pesquisa = e.google_ads?.blocos?.find((b) => b.nome === 'Rede de Pesquisa')
  if (!pesquisa) {
    erros.push('"google_ads.blocos" precisa de um bloco chamado "Rede de Pesquisa" (base da verba das keywords)')
  }

  if (e.keywords) {
    const soma = somaPct(e.keywords.campanhas ?? [])
    if (soma - TOLERANCIA > 100) {
      erros.push(`"keywords.campanhas" não pode somar mais de 100 (soma atual: ${soma})`)
    }
    for (const c of e.keywords.campanhas ?? []) {
      if (!c.nome || !c.desc) erros.push(`Campanha de keywords sem "nome" ou "desc"`)
      for (const g of c.grupos ?? []) {
        if (g.tipo && g.tipo !== 'frase' && g.tipo !== 'exata') {
          erros.push(`Grupo "${g.titulo}" (${c.nome}): "tipo" deve ser "frase" ou "exata"`)
        }
        if (!g.termos?.length) erros.push(`Grupo "${g.titulo}" (${c.nome}) sem termos`)
      }
    }
    if (!e.keywords.negativas?.grupos?.length) erros.push('"keywords.negativas" precisa de grupos')
  }

  if (e.pacotes && !e.pacotes.slots?.length) erros.push('"pacotes.slots" precisa de pelo menos um slot')
  if (e.callout && (!e.callout.frase || !e.callout.grande)) erros.push('"callout" precisa de "frase" e "grande"')
  if (e.funil && !e.funil.linhas?.length) erros.push('"funil.linhas" precisa de pelo menos uma linha')

  return erros
}
