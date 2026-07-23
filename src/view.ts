import { parseEstrategia, ParseError } from './parser'
import { validarEstrategia } from './validate'
import { attachPreviewHandlers, renderBody, tituloPagina } from './render'
import type { Estrategia } from './types'

export function setFavicon(emoji: string): void {
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${encodeURIComponent(emoji)}</text></svg>`
}

/** Parseia + valida; lança ParseError com a lista de problemas. */
export function prepararEstrategia(md: string): Estrategia {
  const estrategia = parseEstrategia(md)
  const erros = validarEstrategia(estrategia)
  if (erros.length) throw new ParseError('Estratégia inválida:\n' + erros.map((e) => `• ${e}`).join('\n'))
  return estrategia
}

/** Renderiza a página do cliente dentro de um container. */
export function renderizarEstrategiaEm(container: HTMLElement, md: string, atualizarAba = true): Estrategia {
  const estrategia = prepararEstrategia(md)
  container.innerHTML = renderBody(estrategia)
  attachPreviewHandlers(container)
  if (atualizarAba) {
    document.title = tituloPagina(estrategia)
    setFavicon(estrategia.favicon)
  }
  return estrategia
}
