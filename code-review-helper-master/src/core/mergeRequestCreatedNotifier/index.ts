import { mergeRequestInfoGetter as getMergeRequestInfoFromGitlab } from '@/core/mergeRequestCreatedNotifier/mergeRequestInfoGetters/gitlab'
import { notify as notifySeatalk } from '@/core/mergeRequestCreatedNotifier/notifiers/seatalk'
import { MergeRequestInfo } from '@/core/mergeRequestCreatedNotifier/model'
import { packNotifyOptionFromMergeRequestInfo } from '@/core/mergeRequestCreatedNotifier/packNotifyOptionFromMergeRequestInfo'
import { NotifyOption } from '@/model/seatalk/notify'

interface NotifyFunctionPair {
  getMergeRequestInfo: () => MergeRequestInfo | Promise<MergeRequestInfo>
  sendNotify: (option: NotifyOption) => unknown | Promise<unknown>
  type: string
}

const notifyFunctionPairs: NotifyFunctionPair[] = [
  {
    getMergeRequestInfo: getMergeRequestInfoFromGitlab,
    sendNotify: notifySeatalk,
    type: 'default',
  },
]

/**
 * Attention:
 * Gitlab will NOT launch the pipeline for merge request
 * when someone edit the merge request config (by click 'edit' and 'save changes' buttons on merge request pages)
 * so notifyAssigneesWhenMergeRequestCreated will not be call
 * That is why rebuild action is needed when assignees list (or other config) changes
 *
 * 注意：
 * Gitlab pipeline的MR事件并不会在点击编辑mr并保存的时机触发，所以如果漏配了assignees导致此函数失败，那么需要编辑完手动点一下rebuild
 */
export const notifyAssignees = async (type = 'default') => {
  const notifyFunctionPair = await notifyFunctionPairs.find((pair) => pair.type === type)
  if (!notifyFunctionPair) {
    throw new Error('Wrong parameters: [type]')
  }
  const { sendNotify, getMergeRequestInfo } = notifyFunctionPair
  const mergeRequestInfo = await getMergeRequestInfo()
  if (mergeRequestInfo.isWIP || mergeRequestInfo.title.includes('WIP:')) {
    console.log('isWIP, skipping...')
    return
  }
  const notifyOption = packNotifyOptionFromMergeRequestInfo(mergeRequestInfo)
  await sendNotify(notifyOption)
}
