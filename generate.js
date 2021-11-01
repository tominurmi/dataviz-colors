import palettes from './src/colors.js'
import fs from 'fs'

const colorVars = palettes.reduce((acc, palette) => {
  palette.colors.forEach(color => acc.push(`--f-dv-${palette.name.toLowerCase()}-${color.weight}: ${color.hex};`))

  return acc
}, [])

const output = `
:root,
:host {
  ${colorVars.join('\n  ')}
}
`.trim()

fs.writeFileSync('./lib/vars.css', output)
