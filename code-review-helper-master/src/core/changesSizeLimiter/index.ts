import { changedShaGetters } from '@/core/changesSizeLimiter/changedShaGetters/gitlab'
import { getChangeInfo } from '@/core/changesSizeLimiter/getChangeInfo'
import { ChangedSha } from '@/core/changesSizeLimiter/model'

export const changesSizeLimit = async (limit = '9999', ...whiteList: string[]) => {
  const limitNumber = Number.parseInt(limit, 10)
  if (Number.isNaN(limitNumber)) {
    throw new Error('first param: [limit] is invalid')
  }

  const changeSha: ChangedSha = await changedShaGetters()
  const mergeRequestChangeInfo = await getChangeInfo(changeSha.baseSha, changeSha.headSha, whiteList)
  const totalChangeLineNumbers =
    mergeRequestChangeInfo.checkedLineDiff.deletionLineNumber +
    mergeRequestChangeInfo.checkedLineDiff.insertionLineNumber

  if (totalChangeLineNumbers > limitNumber && !changeSha.shouldSkip) {
    console.error('commit 大小超限制', { whiteList, mergeRequestChangeInfo, limitNumber })
    process.exit(-1)
  }
}
