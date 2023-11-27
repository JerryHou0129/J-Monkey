import { StatefulMergeRequestInfo, MrStatusDetail, ReceiversToMRInfoMap } from '@/core/mergeRequestStatusNotifier/model'
import { NotifyOption } from '@/model/seatalk/notify'
import { getUserEmailById } from '@/utils/gitlab/getUserEmailsById'

export async function sendMessage(
  receiversToMrMap: ReceiversToMRInfoMap,
  notify: (option: NotifyOption) => unknown | Promise<unknown>,
) {
  for (const [receiverId, mrList] of Object.entries(receiversToMrMap)) {
    const timeoutContents: string[] = []
    const pendingContents: string[] = []
    const crFinishedContents: string[] = []
    const resolvedContents: string[] = []
    const approvedContents: string[] = []

    /**
     * 仅在有其他状态MR的情况下，提醒pending状态的MR，即全是pending状态的MR的时候不提醒
     */
    if (mrList.every((mr) => mr.statusDetail === MrStatusDetail.PENDING)) {
      console.log('all mr is pending, skip notification')
      return
    }

    mrList.forEach((mrItem: StatefulMergeRequestInfo) => {
      const { statusDetail, web_url: webUrl } = mrItem
      switch (statusDetail) {
        case MrStatusDetail.TIMEOUT:
          timeoutContents.push(`${webUrl}/diffs \n`)
          break
        case MrStatusDetail.PENDING:
          pendingContents.push(`${webUrl}/diffs \n`)
          break
        case MrStatusDetail.CR_FINISHED:
          crFinishedContents.push(`${webUrl}/diffs \n`)
          break
        case MrStatusDetail.RESOLVED:
          resolvedContents.push(`${webUrl}/diffs \n`)
          break
        case MrStatusDetail.APPROVED:
          approvedContents.push(`${webUrl}/diffs \n`)
          break
        default:
          break
      }
    })

    let content = ''
    if (timeoutContents.length) {
      content += `\n您有${timeoutContents.length}条MR已经超时未review：\n${timeoutContents.join('')}`
    }
    if (pendingContents.length) {
      content += `\n您有${pendingContents.length}条MR等待review：\n${pendingContents.join('')}`
    }
    if (crFinishedContents.length) {
      content += `\n您有${crFinishedContents.length}条MR已经review完成：\n${crFinishedContents.join('')}`
    }
    if (resolvedContents.length) {
      content += `\n您有${
        resolvedContents.length
      }条MR的 all threads resolved，等待再次review：\n${resolvedContents.join('')}`
    }
    if (approvedContents.length) {
      content += `\n您有${approvedContents.length}条MR已经approved，等待合入：\n${approvedContents.join('')}`
    }

    if (content.length) {
      const receiversEmails = await getUserEmailById(receiverId)
      await notify({ content, mentionedEmailList: receiversEmails })
    }
  }
}
