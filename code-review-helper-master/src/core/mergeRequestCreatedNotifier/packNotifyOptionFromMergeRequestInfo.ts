import { MergeRequestInfo } from '@/core/mergeRequestCreatedNotifier/model'
import { NotifyOption } from '@/model/seatalk/notify'

export function packNotifyOptionFromMergeRequestInfo(options: MergeRequestInfo): NotifyOption {
  const { description, author, sourceBranch, targetBranch, title, assigneeEmails, link } = options
  const mergeRequestDescriptionLine = description ? `Description: ${description} \n` : ''
  const content =
    `\n\n${author} 创建了一个MR \n \n` +
    `Title: ${title} \n` +
    `${mergeRequestDescriptionLine}` +
    `Link: ${link}/diffs \n` +
    `SourceBranch: ${sourceBranch}\n` +
    `TargetBranch: ${targetBranch}\n` +
    '\n请您走查'
  return { mentionedEmailList: assigneeEmails, content }
}
