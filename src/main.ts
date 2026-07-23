import './styles/fonts.css'
import './styles/template.css'
import './styles/app.css'
import { buscarEstrategia, supabaseConfigurado } from './supabase'
import { renderizarEstrategiaEm } from './view'
import { montarAdmin } from './admin'

const app = document.getElementById('app')!

function mensagem(titulo: string, texto: string): void {
  app.innerHTML = `<div class="msg-page"><div class="msg-card"><h1>${titulo}</h1><p>${texto}</p></div></div>`
}

async function paginaCliente(slug: string): Promise<void> {
  if (!supabaseConfigurado) {
    mensagem('Configuração pendente', 'O Supabase ainda não foi configurado (src/config.ts).')
    return
  }
  mensagem('Carregando…', 'Buscando a estratégia.')
  try {
    const registro = await buscarEstrategia(slug)
    if (!registro) {
      mensagem('Não encontrada', 'Confira o link recebido — esta estratégia não existe ou foi removida.')
      return
    }
    renderizarEstrategiaEm(app, registro.md_source)
  } catch (e) {
    mensagem('Erro ao carregar', e instanceof Error ? e.message : String(e))
  }
}

function landing(): void {
  mensagem('Komplexa · Estratégias', 'Ferramenta interna. Se você recebeu um link de estratégia, use o endereço completo enviado pela equipe.')
}

// Router: caminhos relativos ao BASE_URL do Vite ("/" no dev, "/estrategia-index/" no Pages)
const base = import.meta.env.BASE_URL
const caminho = decodeURIComponent(location.pathname)
const rota = (caminho.startsWith(base) ? caminho.slice(base.length) : caminho.replace(/^\//, '')).replace(/\/+$/, '')

if (rota === '') landing()
else if (rota === 'admin') void montarAdmin(app)
else if (rota.startsWith('e/')) void paginaCliente(rota.slice(2))
else landing()
