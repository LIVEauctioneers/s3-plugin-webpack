import {sep as pathSep} from 'node:path'
import readDir from 'recursive-readdir'
import {isRegExp} from 'node:util/types'

export const UPLOAD_IGNORES = [
  '.DS_Store'
]

export const DEFAULT_UPLOAD_OPTIONS = {
  ACL: 'public-read'
}

export const REQUIRED_S3_UP_OPTS = ['Bucket']
export const PATH_SEP = pathSep
export const S3_PATH_SEP = '/'
export const DEFAULT_TRANSFORM = (item) => Promise.resolve(item)

export const addTrailingS3Sep = fPath => {
  return fPath ? fPath.replace(/\/?(\?|#|$)/, '/$1') : fPath
}

export const addSeperatorToPath = (fPath) => {
  if (!fPath)
    return fPath

  return fPath.endsWith(PATH_SEP) ? fPath : fPath + PATH_SEP
}

export const translatePathFromFiles = (rootPath) => {
  return files => {
    return files.map(file => {
      return {
        path: file,
        name: file
          .replace(rootPath, '')
          .split(PATH_SEP)
          .join(S3_PATH_SEP)
      }
    })
  }
}

export const getDirectoryFilesRecursive = (dir, ignores = []) => {
  return new Promise((resolve, reject) => {
    readDir(dir, ignores, (err, files) => err ? reject(err) : resolve(files))
  })
    .then(translatePathFromFiles(dir))
}

export const testRule = (rule, subject) => {
  if (isRegExp(rule)) {
    return rule.test(subject)
  } else if (rule instanceof Function) {
    return !!rule(subject)
  } else if (Array.isArray(rule)) {
    return rule.every((condition) => testRule(condition, subject))
  } else if (rule instanceof String) {
    return new RegExp(rule).test(subject)
  } else {
    throw new Error('Invalid include / exclude rule')
  }
}
