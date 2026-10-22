import path from 'node:path'
import fs from 'node:fs/promises'

export default async function writeJSON(object) {

  try {
    const pathJSON = path.join('ai-response.json')
    
    await fs.writeFile(
      pathJSON,
      JSON.stringify(object, null, 2),
      'utf8'
    )
  } catch (err) {
    throw new Error(err)
  }
}
