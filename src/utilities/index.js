import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const allFiles = async (dirPath) => {
    const files = await walk(dirPath)
    const result = files.flat(Number.POSITIVE_INFINITY).map(element => {
        return element.replace(" - ", "/")
    })
    return result
}

const searchFiles = async (filePaths, searchString) => {
    const result = await readFiles(filePaths, searchString)
    return result.filter(x => x !== undefined)
}

const searchFilesWithPrefixAndArray = async (files, prefix, array) => Promise.all(
    array.map(async element => {
        const searchString = `${prefix}.${element}`
        const result = await searchFiles(files, searchString)
        return { color: element, files: result }
    })
)

const walk = async (dirPath) => Promise.all(
    await readdir(dirPath, { withFileTypes: true }).then((entries) => entries.map((entry) => {
        const childPath = join(dirPath, entry.name)
        return entry.isDirectory() ? walk(childPath) : childPath
    })),
)

const readFiles = async (filePaths, searchString) => Promise.all(
    await filePaths.map(async filePath => {
        return await readFile(filePath, 'utf8').then((contents) => {
            if (contents.includes(searchString)) {
                return filePath
            }
        })
    })
)

export { allFiles, searchFiles, searchFilesWithPrefixAndArray }
