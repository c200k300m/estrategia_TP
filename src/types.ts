export interface SubFrente {
  nome: string
  pct: number
  pendencia?: string
}

export interface Frente extends SubFrente {
  sub_frentes?: SubFrente[]
}

export interface CanalAds {
  titulo?: string | null
  sub: string
  nota?: string
}

export interface MetaAds extends CanalAds {
  frentes: Frente[]
}

export interface GoogleAds extends CanalAds {
  blocos: Frente[]
}

export interface GrupoKeywords {
  titulo: string
  tipo?: 'frase' | 'exata'
  termos: string[]
}

export interface CampanhaKeywords {
  nome: string
  pct: number
  aberta?: boolean
  desc: string
  grupos: GrupoKeywords[]
  obs?: string
}

export interface Negativas {
  desc: string
  grupos: GrupoKeywords[]
  obs?: string
}

export interface Keywords {
  sub: string
  campanhas: CampanhaKeywords[]
  negativas: Negativas
}

export interface Slot {
  nome: string
  definido: boolean
}

export interface Pacotes {
  sub: string
  slots: Slot[]
  sugestoes?: string[]
  nota?: string
}

export interface CardCriativo {
  tag: string
  nome: string
  url: string
  sem_preview?: boolean
}

export interface Briefing {
  tag: string
  conceito: string
  headline: string
  texto: string
  destaques?: string[]
  oferta?: string
  cta: string
}

export interface GrupoBriefing {
  titulo: string
  sub: string
  cards?: CardCriativo[]
  briefings?: Briefing[]
}

export interface BriefingCriativos {
  sub: string
  grupos: GrupoBriefing[]
  nota?: string
}

export interface GrupoAprovacao {
  titulo: string
  sub: string
  itens: CardCriativo[]
}

export interface AprovacaoCriativos {
  sub: string
  grupos: GrupoAprovacao[]
}

export interface LinhaFunil {
  label: string
  valor: string | number
  taxa?: boolean
  destaque?: boolean
  positivo?: boolean
}

export interface Funil {
  sub: string
  linhas: LinhaFunil[]
  nota?: string
}

export interface Callout {
  frase: string
  grande: string
}

export interface Estrategia {
  cliente: string
  unidade: 'Hotéis' | 'Growth'
  cidade: string
  favicon: string
  objetivo: string
  subtitulo: string
  footer: string
  verba_mensal: number
  split: { meta: number; google: number }
  meta_ads: MetaAds
  google_ads: GoogleAds
  keywords: Keywords
  pacotes?: Pacotes
  briefing_criativos?: BriefingCriativos
  aprovacao_criativos?: AprovacaoCriativos
  funil?: Funil
  callout?: Callout
}
