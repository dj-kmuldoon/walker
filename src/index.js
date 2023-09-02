import { searchFiles, allFiles, searchFilesWithPrefixAndArray } from './utilities/index.js'
import { WSJS_CONTEXTUAL_COLORS } from './constants/index.js'

const rootPath = "../DJ-Mobile-App-iOS/DJMobileApp"
const searchString = "themeCoordinator.theme.colorScheme"

async function Main() {

  var files = await allFiles(rootPath)                          // All files in rootPath
  files = files.filter(file => file.endsWith(".swift"))         // Exclude files without .swift file extension
  files = files.filter(file => !file.includes("/djds.theme"))   // Exclude files with '/djds.theme' in path
  files = files.filter(file => !file.includes("/Theme/"))       // Exclude files with '/Theme/' in path

  // themeCoordinator.theme.colorScheme
  const allFilesContainingThemeCoordinatorColorScheme = await searchFiles(files, searchString)
  console.log(allFilesContainingThemeCoordinatorColorScheme)

  // mapThemedColorsMappedToFiles
  const allFilesContainingWSJSContextualColors = await searchFilesWithPrefixAndArray(files, searchString, WSJS_CONTEXTUAL_COLORS)
  console.log("themedColorsMappedToFiles ->", allFilesContainingWSJSContextualColors)

}

export default Main()
