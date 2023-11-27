import { MrStatusDetail, ReceiversToMRInfoMap, StatefulMergeRequestInfo } from '@/core/mergeRequestStatusNotifier/model'

function pushToAuthorReceiveMap(mrItem: StatefulMergeRequestInfo, receivers: ReceiversToMRInfoMap) {
  const authorId = mrItem.author.id
  const mrList = receivers[authorId]
  receivers[authorId] = [...(mrList ?? []), mrItem]
}

function pushToReviewerReceiveMap(mrItem: StatefulMergeRequestInfo, receivers: ReceiversToMRInfoMap) {
  mrItem.assignees.forEach((item) => {
    const mrList = receivers[item.id]
    receivers[item.id] = [...(mrList ?? []), mrItem]
  })
}

/**
 * distribute merge request to reviewer by merge request status
 * @param statefulMrList full merge request list
 * @returns a map, key is gitlab user id, which means who should receive notification
 * value is a series of MRs in various states
 */
export function getClassifiedMergeRequestReceivers(statefulMrList: StatefulMergeRequestInfo[]): ReceiversToMRInfoMap {
  const classifiedReceivers: ReceiversToMRInfoMap = {}

  statefulMrList.forEach((mrItem) => {
    switch (mrItem.statusDetail) {
      case MrStatusDetail.APPROVED:
      case MrStatusDetail.CR_FINISHED:
        pushToAuthorReceiveMap(mrItem, classifiedReceivers)
        break
      case MrStatusDetail.RESOLVED:
      case MrStatusDetail.TIMEOUT:
      case MrStatusDetail.PENDING:
        pushToReviewerReceiveMap(mrItem, classifiedReceivers)
        break
      case MrStatusDetail.WIP_OR_DRAFT:
        break
      case MrStatusDetail.PIPELINE_FAILED:
        break
      default:
        break
    }
  })

  return classifiedReceivers
}
