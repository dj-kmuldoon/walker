import { searchFiles, allFiles, writeFileAsync, searchFilesWithPrefixAndArray, difference } from './utilities/index.js'
import { WSJS_CONTEXTUAL_COLORS, WSJS_TEXT_STYLES} from './constants/index.js'

const rootPath = "../DJ-Mobile-App-iOS/DJMobileApp"
const colorScheme = "themeCoordinator.theme.colorScheme"
const textStyles = 'themeCoordinator.theme.textStyles'

async function Main() {

  var files = await allFiles(rootPath)                          // All files in rootPath
  files = files.filter(file => file.endsWith(".swift"))         // Exclude files without .swift file extension
  files = files.filter(file => !file.includes("/djds.theme"))   // Exclude files with '/djds.theme' in path
  files = files.filter(file => !file.includes("/Theme/"))       // Exclude files with '/Theme/' in path

  // Get all files that contain the string 'themeCoordinator.theme.colorScheme'
  const allFilesContainingColorScheme = await searchFiles(files, colorScheme)
  // console.log("// allFilesContainingColorScheme")
  // console.log(allFilesContainingColorScheme)

  const allFilesContainingTextStyles = await searchFiles(files, textStyles)
  console.log("// allFilesContainingTextStyles")
  console.log(allFilesContainingTextStyles)

  // Create an object that maps all files containing 'themeCoordinator.theme.colorScheme' + colorScheme
  // This function returns, i.e {color: 'borderPrimary', files: ['this-file', 'that-file', 'other-file']}
  const allFilesContainingWSJSContextualColors = await searchFilesWithPrefixAndArray(files, colorScheme, WSJS_CONTEXTUAL_COLORS)
  console.log("themedColorsMappedToFiles ->", allFilesContainingWSJSContextualColors)

  // Create an array of WSJS+ contextual color names that files reference
  const WSJSContextualColorsReferenced = allFilesContainingWSJSContextualColors.filter(element => element.files.length > 0).map(element => element.item)
  const contextualColorsUnused = difference(WSJSContextualColorsReferenced, WSJS_CONTEXTUAL_COLORS)

  // Create an object that maps all files containing 'themeCoordinator.theme.colorScheme' + textStyle
  // This function returns, i.e {color: 'borderPrimary', files: ['this-file', 'that-file', 'other-file']}
  const allFilesContainingWSJSTextStyles = await searchFilesWithPrefixAndArray(files, textStyles, WSJS_TEXT_STYLES)
  console.log("allFilesContainingWSJSTextStyles ->", allFilesContainingWSJSTextStyles)

  const WSJSTextStylesReferenced = allFilesContainingWSJSTextStyles.filter(element => element.files.length > 0).map(element => element.item)
  const textStylesUnused = difference(WSJSTextStylesReferenced, WSJS_TEXT_STYLES)

  writeFileAsync("src/reports/containing/filesContaining 'themeCoordinator.theme.colorScheme'.txt", allFilesContainingColorScheme.join("\r")) 
  writeFileAsync("src/reports/containing/filesContaining 'themeCoordinator.theme.textStyles'.txt", allFilesContainingTextStyles.join("\r")) 
  
  writeFileAsync("src/reports/defined/contextualColorsDefined.txt", WSJS_CONTEXTUAL_COLORS.join("\r")) 
  writeFileAsync("src/reports/defined/textStylesDefined.txt", WSJS_TEXT_STYLES.join("\r")) 

  writeFileAsync("src/reports/referenced/contextualColorsReferenced.txt", WSJSContextualColorsReferenced.join("\r")) 
  writeFileAsync("src/reports/referenced/textStylesReferenced.txt", WSJSTextStylesReferenced.join("\r")) 

  writeFileAsync("src/reports/unused/contextualColorsUnused.txt", contextualColorsUnused.join("\r")) 
  writeFileAsync("src/reports/unused/textStylesUnused.txt", textStylesUnused.join("\r")) 


}

export default Main()
