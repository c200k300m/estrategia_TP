import { load, YAMLException } from 'js-yaml'
import type { Estrategia } from './types'

export class ParseError extends Error {}

/** Extrai e parseia o frontmatter YAML de um .md de estratégia. */
export function parseEstrategia(md: string): Estrategia {
  const m = md.match(/^﻿?---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/)
  if (!m) {
    throw new ParseError(
      'Frontmatter não encontrado: o arquivo precisa começar com "---" e ter um segundo "---" fechando o YAML.',
    )
  }
  let data: unknown
  try {
    data = load(m[1])
  } catch (e) {
    if (e instanceof YAMLException) {
      const linha = e.mark ? ` (linha ${e.mark.line + 1})` : ''
      throw new ParseError(`YAML inválido${linha}: ${e.reason ?? e.message}`)
    }
    throw e
  }
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new ParseError('O frontmatter precisa ser um objeto YAML.')
  }
  return data as Estrategia
}
