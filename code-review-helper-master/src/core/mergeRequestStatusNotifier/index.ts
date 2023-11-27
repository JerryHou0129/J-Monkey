import { sendMessage } from '@/core/mergeRequestStatusNotifier/sendMessage'
import { getClassifiedMergeRequestReceivers } from '@/core/mergeRequestStatusNotifier/getClassifiedMergeRequestReceivers'
import { getStatefulMrList as getStatefulMrListFromGitlab } from '@/core/mergeRequestStatusNotifier/statefulMrListGetter/gitlab'
import { StatefulMergeRequestInfo } from '@/core/mergeRequestStatusNotifier/model'
import { NotifyOption } from '@/model/seatalk/notify'
import { notify } from '@/core/mergeRequestStatusNotifier/notifiers/seatalk'

interface NotifyFunctionPair {
  getStatefulMrList: (
    mrUrgeViewGapTime: number,
    crFinishedGapTime: number,
  ) => StatefulMergeRequestInfo[] | Promise<StatefulMergeRequestInfo[]>
  sendNotify: (option: NotifyOption) => unknown | Promise<unknown>
  type: string
}

const notifyFunctionPairs: NotifyFunctionPair[] = [
  {
    getStatefulMrList: getStatefulMrListFromGitlab,
    sendNotify: notify,
    type: 'default',
  },
]

export const mergeRequestStatusNotifier = async (
  mrUrgeViewGapTime = '60',
  crFinishedGapTime = '60',
  type = 'default',
) => {
  const notifyFunctionPair = await notifyFunctionPairs.find((pair) => pair.type === type)
  if (!notifyFunctionPair) {
    throw new Error('Wrong parameters: [type]')
  }
  const { sendNotify, getStatefulMrList } = notifyFunctionPair

  const mrUrgeViewTimeNumber = parseInt(mrUrgeViewGapTime, 10)
  const crFinishedGapTimeNumber = parseInt(crFinishedGapTime, 10)

  const statefulMrList = await getStatefulMrList(mrUrgeViewTimeNumber, crFinishedGapTimeNumber)
  const receiversToMrMap = getClassifiedMergeRequestReceivers(statefulMrList)

  await sendMessage(receiversToMrMap, sendNotify)
}
