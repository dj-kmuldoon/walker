import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

const allFiles = async (dirPath) => {
    const files = await walk(dirPath)
    const result = files.flat(Number.POSITIVE_INFINITY).map(element => {
        return element.replace(" - ", "/")
    })
    return result
}

const walk = async (dirPath) => Promise.all(
  await readdir(dirPath, { withFileTypes: true }).then((entries) => entries.map((entry) => {
    const childPath = join(dirPath, entry.name)
    return entry.isDirectory() ? walk(childPath) : childPath
  })),
)

const files = await allFiles('../find')

files.map(file => {
  console.log("->", file)
})