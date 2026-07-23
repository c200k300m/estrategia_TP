// Modo dev / CLI: renderiza um .md de estratégia para HTML standalone.
// Uso: npm run render -- fixtures/reais/araguaia-tur.md [saida.html]
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { parseEstrategia } from '../src/parser'
import { validarEstrategia } from '../src/validate'
import { renderPaginaCompleta } from '../src/render'

const entrada = process.argv[2]
if (!entrada) {
  console.error('Uso: npm run render -- <arquivo.md> [saida.html]')
  process.exit(1)
}

const md = readFileSync(entrada, 'utf-8')
const estrategia = parseEstrategia(md)
const erros = validarEstrategia(estrategia)
if (erros.length) {
  console.error(`Estratégia inválida (${entrada}):`)
  for (const e of erros) console.error(`  - ${e}`)
  process.exit(1)
}

const css =
  readFileSync(resolve('src/styles/fonts.css'), 'utf-8') +
  readFileSync(resolve('src/styles/template.css'), 'utf-8')

let saida = process.argv[3]
if (!saida) {
  mkdirSync(resolve('fixtures/out'), { recursive: true })
  saida = resolve('fixtures/out', basename(entrada).replace(/\.md$/, '.html'))
}
writeFileSync(saida, renderPaginaCompleta(estrategia, css))
console.log(`OK → ${saida}`)
