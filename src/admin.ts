import { supabase, supabaseConfigurado } from './supabase'
import { prepararEstrategia, renderizarEstrategiaEm } from './view'
import { ParseError } from './parser'

interface Registro {
  id: string
  slug: string
  cliente: string
  updated_at: string
}

const ALFABETO_SLUG = 'abcdefghjkmnpqrstuvwxyz23456789'

function slugAleatorio(cliente: string): string {
  const kebab = cliente
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  const bytes = crypto.getRandomValues(new Uint8Array(4))
  const sufixo = Array.from(bytes, (b) => ALFABETO_SLUG[b % ALFABETO_SLUG.length]).join('')
  return `${kebab}-${sufixo}`
}

function linkDe(slug: string): string {
  return `${location.origin}${import.meta.env.BASE_URL}e/${slug}`
}

export async function montarAdmin(app: HTMLElement): Promise<void> {
  document.title = 'Admin · Komplexa Estratégias'
  if (!supabaseConfigurado || !supabase) {
    app.innerHTML = `<div class="msg-page"><div class="msg-card"><h1>Configuração pendente</h1>
      <p>Preencha SUPABASE_URL e SUPABASE_ANON_KEY em <code>src/config.ts</code> (Fase 3 do PLANO.md).</p></div></div>`
    return
  }

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    montarLogin(app)
    return
  }
  await montarPainel(app)
}

function montarLogin(app: HTMLElement): void {
  app.innerHTML = `<div class="msg-page"><form class="msg-card admin-login" id="form-login">
    <h1>Admin · Estratégias</h1>
    <label>E-mail <input type="email" name="email" required autocomplete="username"></label>
    <label>Senha <input type="password" name="senha" required autocomplete="current-password"></label>
    <button type="submit" class="btn-primario">Entrar</button>
    <p class="admin-erro" id="login-erro" hidden></p>
  </form></div>`
  const form = document.getElementById('form-login') as HTMLFormElement
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault()
    const dados = new FormData(form)
    const { error } = await supabase!.auth.signInWithPassword({
      email: String(dados.get('email')),
      password: String(dados.get('senha')),
    })
    const erroEl = document.getElementById('login-erro')!
    if (error) {
      erroEl.textContent = 'Login falhou: ' + error.message
      erroEl.hidden = false
      return
    }
    await montarAdmin(app.closest('#app') as HTMLElement ?? app)
  })
}

async function listar(): Promise<Registro[]> {
  const { data, error } = await supabase!
    .from('estrategias')
    .select('id, slug, cliente, updated_at')
    .order('updated_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

async function montarPainel(app: HTMLElement): Promise<void> {
  app.innerHTML = `<div class="admin">
    <header class="admin-topo">
      <strong>Komplexa · Estratégias</strong>
      <button type="button" id="btn-sair" class="btn-fantasma">Sair</button>
    </header>
    <div class="admin-corpo">
      <aside class="admin-lista">
        <button type="button" id="btn-nova" class="btn-primario">+ Nova estratégia</button>
        <ul id="lista"></ul>
      </aside>
      <section class="admin-editor">
        <div class="admin-editor-topo">
          <span id="editor-titulo">Nova estratégia</span>
          <span id="editor-link"></span>
        </div>
        <textarea id="md" spellcheck="false" placeholder="Cole aqui o .md da estratégia (frontmatter YAML — ver docs/formato-estrategia.md)"></textarea>
        <div class="admin-acoes">
          <button type="button" id="btn-validar" class="btn-fantasma">Validar</button>
          <button type="button" id="btn-preview" class="btn-fantasma">Pré-visualizar</button>
          <button type="button" id="btn-publicar" class="btn-primario">Publicar</button>
        </div>
        <pre class="admin-erro" id="editor-msg" hidden></pre>
      </section>
    </div>
    <div class="admin-preview" id="preview" hidden>
      <button type="button" id="btn-fechar-preview" class="btn-primario">Fechar prévia</button>
      <div id="preview-conteudo"></div>
    </div>
  </div>`

  const ta = document.getElementById('md') as HTMLTextAreaElement
  const msg = document.getElementById('editor-msg') as HTMLPreElement
  const linkEl = document.getElementById('editor-link')!
  const tituloEl = document.getElementById('editor-titulo')!
  let atual: Registro | null = null

  const mostrar = (texto: string, erro = true): void => {
    msg.textContent = texto
    msg.hidden = false
    msg.classList.toggle('ok', !erro)
  }

  const atualizarLista = async (): Promise<void> => {
    const ul = document.getElementById('lista')!
    try {
      const registros = await listar()
      ul.innerHTML = registros.map((r) =>
        `<li><button type="button" data-id="${r.id}" data-slug="${r.slug}">${r.cliente}</button>
         <a href="${linkDe(r.slug)}" target="_blank" rel="noopener" title="Abrir página do cliente">↗</a></li>`).join('')
      ul.querySelectorAll<HTMLButtonElement>('button[data-id]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const { data, error } = await supabase!
            .from('estrategias').select('id, slug, cliente, md_source, updated_at')
            .eq('id', btn.dataset.id!).single()
          if (error) { mostrar('Erro ao abrir: ' + error.message); return }
          atual = data
          ta.value = data.md_source
          tituloEl.textContent = data.cliente
          linkEl.innerHTML = `<a href="${linkDe(data.slug)}" target="_blank" rel="noopener">${linkDe(data.slug)}</a>`
          msg.hidden = true
        })
      })
    } catch (e) {
      mostrar('Erro ao listar: ' + (e instanceof Error ? e.message : String(e)))
    }
  }

  document.getElementById('btn-sair')!.addEventListener('click', async () => {
    await supabase!.auth.signOut()
    location.reload()
  })

  document.getElementById('btn-nova')!.addEventListener('click', () => {
    atual = null
    ta.value = ''
    tituloEl.textContent = 'Nova estratégia'
    linkEl.textContent = ''
    msg.hidden = true
  })

  document.getElementById('btn-validar')!.addEventListener('click', () => {
    try {
      const e = prepararEstrategia(ta.value)
      mostrar(`Válida ✓ — ${e.cliente} · ${e.cidade} · R$ ${e.verba_mensal.toLocaleString('pt-BR')}/mês`, false)
    } catch (e) {
      mostrar(e instanceof ParseError ? e.message : String(e))
    }
  })

  const preview = document.getElementById('preview')!
  document.getElementById('btn-preview')!.addEventListener('click', () => {
    try {
      renderizarEstrategiaEm(document.getElementById('preview-conteudo')!, ta.value, false)
      preview.hidden = false
    } catch (e) {
      mostrar(e instanceof ParseError ? e.message : String(e))
    }
  })
  document.getElementById('btn-fechar-preview')!.addEventListener('click', () => {
    preview.hidden = true
  })

  document.getElementById('btn-publicar')!.addEventListener('click', async () => {
    let cliente: string
    try {
      cliente = prepararEstrategia(ta.value).cliente
    } catch (e) {
      mostrar(e instanceof ParseError ? e.message : String(e))
      return
    }
    try {
      if (atual) {
        const { error } = await supabase!
          .from('estrategias')
          .update({ cliente, md_source: ta.value })
          .eq('id', atual.id)
        if (error) throw new Error(error.message)
        mostrar(`Republicada ✓ — o link do cliente continua o mesmo:\n${linkDe(atual.slug)}`, false)
      } else {
        const slug = slugAleatorio(cliente)
        const { data, error } = await supabase!
          .from('estrategias')
          .insert({ slug, cliente, md_source: ta.value })
          .select('id, slug, cliente, updated_at')
          .single()
        if (error) throw new Error(error.message)
        atual = data
        tituloEl.textContent = cliente
        linkEl.innerHTML = `<a href="${linkDe(slug)}" target="_blank" rel="noopener">${linkDe(slug)}</a>`
        mostrar(`Publicada ✓ — link secreto do cliente:\n${linkDe(slug)}`, false)
      }
      await atualizarLista()
    } catch (e) {
      mostrar('Erro ao publicar: ' + (e instanceof Error ? e.message : String(e)))
    }
  })

  await atualizarLista()
}
