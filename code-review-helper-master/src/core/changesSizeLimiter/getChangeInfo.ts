import { promisify } from 'util'
import { exec } from 'child_process'

const promisifiedExec = promisify(exec)

function getGitDiffLineNumber(resultText: string) {
  const insertionRegex = /(\d+) insertion/u
  const insertionMatchResult = resultText.match(insertionRegex)
  const insertionLineNumber = Number(insertionMatchResult?.[1]) ?? 0

  const deletionRegex = /(\d+) deletions/u
  const deletionMatchResult = resultText.match(deletionRegex)
  const deletionLineNumber = Number(deletionMatchResult?.[1]) ?? 0
  return {
    insertionLineNumber,
    deletionLineNumber,
  }
}

export async function getChangeInfo(baseSha: string, headSha: string, whiteList: string[]) {
  /**
   * calculate total diff result (without whiteList)
   */
  const gitDiffShortStat = await promisifiedExec(`git diff --shortstat ${baseSha} ${headSha}`)
  const diffFileList = await promisifiedExec(`git diff --name-only ${baseSha} ${headSha}`)
  if (gitDiffShortStat.stderr || diffFileList.stderr) {
    throw new Error(gitDiffShortStat.stderr ?? diffFileList.stderr)
  }
  // will be a string like '3 files changed, 1 insertion(+), 135 deletions(-)'
  const totalChangesResultText = gitDiffShortStat.stdout
  const diffFileListResultText = diffFileList.stdout
  console.log(
    `git diff ${baseSha} ${headSha} result: ${totalChangesResultText}\n` +
      `\n===========changed file list=========== \n${diffFileListResultText}\n`,
  )

  /**
   * calculate diff result (with whiteList)
   */
  const checkFileList = diffFileListResultText.split('\n').filter((fileName) => {
    if (!fileName) {
      return false
    }
    return !whiteList.some((regexString) => new RegExp(regexString).test(fileName))
  })
  console.log(`\n===========checked file list=========== \n${checkFileList.join('\n')}`)
  const whileListParams = checkFileList.map((fileName) => `'${fileName}'`).join(' ')
  const fullCommand = `git diff --shortstat ${baseSha} ${headSha} -- ${whileListParams}`
  const gitDiffShortStatWithWhiteList = await promisifiedExec(fullCommand)
  if (gitDiffShortStatWithWhiteList.stderr) {
    throw new Error(gitDiffShortStatWithWhiteList.stderr)
  }
  const checkedChangesResultText = gitDiffShortStatWithWhiteList.stdout

  return {
    // whiteList,
    // diffFileList: diffFileListResultText.split('\n').filter((fileName) => !!fileName),
    // checkFileList,
    totalLineDiff: getGitDiffLineNumber(totalChangesResultText),
    checkedLineDiff: getGitDiffLineNumber(checkedChangesResultText),
  }
}
