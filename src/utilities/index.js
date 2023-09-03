import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

export const allFiles = async (dirPath) => {
    const files = await getFilesRecursive(dirPath)
    const result = files.flat(Number.POSITIVE_INFINITY).map(element => {
        return element.replace(" - ", "/").replace(" ", "\ ")
    })
    return result
}

export const searchFiles = async (filePaths, searchString) => {
    const result = await readFiles(filePaths, searchString)
    return result.filter(x => x !== undefined)
}

export const searchFilesWithPrefixAndArray = async (files, prefix, array) => Promise.all(
    array.map(async element => {
        const searchString = `${prefix}.${element}`
        const result = await searchFiles(files, searchString)
        return { item: element, files: result }
    })
)

export const writeFileAsync = async (filePath, data) => {
    writeFile(filePath, data, (err) => {
        if (err) throw err;
    })
}

// Return an array containing all the elements of 'left'  
// that are not in 'right' and vice-versa
export const difference = (left, right) => {
    return left.
        filter(element => !right.includes(element))
        .concat(right.filter(element => !left.includes(element)));
}

const getFilesRecursive = async (dirPath) => Promise.all(
    await readdir(dirPath, { withFileTypes: true }).then((entries) => entries.map((entry) => {
        const childPath = join(dirPath, entry.name)
        return entry.isDirectory() ? getFilesRecursive(childPath) : childPath
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