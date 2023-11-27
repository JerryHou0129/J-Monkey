import moment from 'moment'
import {
  getMergeRequestApprovals,
  getMergeRequestInfo,
  getMergeRequestNotes,
  getProjectMergeRequests,
} from '@/api/gitlab'
import {
  GitlabMergeRequestNote,
  GitlabOrderByType,
  GitlabPipelineStatus,
  GitlabSortType,
  MergeRequestState,
  NoteType,
} from '@/model/gitlab/gitlabOpenAPIModel'
import { MrStatusDetail, StatefulMergeRequestInfo } from '@/core/mergeRequestStatusNotifier/model'

export async function getStatefulMrList(
  crFinishedGapTime: number,
  mrUrgeViewGapTime: number,
): Promise<StatefulMergeRequestInfo[]> {
  const statefulMrList: StatefulMergeRequestInfo[] = []

  const openedMergeRequests = await getProjectMergeRequests(MergeRequestState.OPENED)

  for (const mrItem of openedMergeRequests) {
    // set the state of mr which title is start with WIP or Draft
    if (mrItem.title.startsWith('WIP:') || mrItem.title.startsWith('Draft:')) {
      statefulMrList.push({ ...mrItem, statusDetail: MrStatusDetail.WIP_OR_DRAFT })
      continue
    }
    /**
     * Set the state of Mr which pipeline is not successful
     */
    const mergeRequestInfo = await getMergeRequestInfo(mrItem.iid)
    if (mergeRequestInfo.pipeline.status !== GitlabPipelineStatus.SUCCESS) {
      statefulMrList.push({ ...mrItem, statusDetail: MrStatusDetail.PIPELINE_FAILED })
      continue
    }

    const mergeRequestApproval = await getMergeRequestApprovals(`${mrItem.iid}`)

    /**
     * 必须要有人点过同意才会提醒（即approved_by不为空）否则此提醒无意义
     */
    if (mergeRequestApproval.approved && mergeRequestApproval.approved_by.length) {
      statefulMrList.push({ ...mrItem, statusDetail: MrStatusDetail.APPROVED })
      continue
    }

    const notes = await getMergeRequestNotes({
      merge_request_iid: `${mrItem.iid}`,
      sort: GitlabSortType.DESC,
      order_by: GitlabOrderByType.CREATED_AT,
    })
    /**
     * The type of notes under 'changes' tab are 'diffNote' and the type of the notes under 'overview' tab are null
     */
    const diffNotes = notes.filter(
      (note: GitlabMergeRequestNote) => (note.type === NoteType.DIFFNOTE || note.type === null) && !note.system,
    )

    if (diffNotes.length) {
      const diffTime = diffNotes[0] ? moment().diff(diffNotes[0].created_at, 'minutes') : 0
      if (diffTime >= crFinishedGapTime) {
        /**
         * the 'resolvable' property of note which under 'overview' tab is false
         */
        const unResolvedNotes = diffNotes.filter((item) => item.resolvable && !item.resolved)
        if (unResolvedNotes.length) {
          statefulMrList.push({ ...mrItem, statusDetail: MrStatusDetail.CR_FINISHED })
        } else {
          statefulMrList.push({ ...mrItem, statusDetail: MrStatusDetail.RESOLVED })
        }
      }
    } else {
      const diffTime = moment().diff(mrItem.created_at, 'minutes')
      if (diffTime < mrUrgeViewGapTime) {
        statefulMrList.push({ ...mrItem, statusDetail: MrStatusDetail.PENDING })
      } else {
        statefulMrList.push({ ...mrItem, statusDetail: MrStatusDetail.TIMEOUT })
      }
    }
  }

  return statefulMrList
}
