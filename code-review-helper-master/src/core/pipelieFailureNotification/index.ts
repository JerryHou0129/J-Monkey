import { PipelineJobInfos } from '@/core/pipelieFailureNotification/model'
import { notify } from '@/core/pipelieFailureNotification/notifiers/seatalk'
import { NotifyOption } from '@/model/seatalk/notify'
import { getPipelineJobInfos as getPipelineJobInfosFromGitlab } from './pipelineJobInfosGetters/gitlab'

interface NotifyFunctionPair {
  getPipelineJobInfos: () => PipelineJobInfos | Promise<PipelineJobInfos>
  sendNotify: (option: NotifyOption) => unknown | Promise<unknown>
  type: string
}

const notifyFunctionPairs: NotifyFunctionPair[] = [
  {
    getPipelineJobInfos: getPipelineJobInfosFromGitlab,
    sendNotify: notify,
    type: 'default',
  },
]

const getContent = (pipelineJobInfos: PipelineJobInfos) => {
  let content = '\nPipeline检查失败\n'
  const { jobInfos } = pipelineJobInfos
  jobInfos.forEach((item) => {
    content = `${content}${item.name} job failed,详情请查看${item.webUrl}\n`
  })
  return content
}

export const pipelineFailureNotification = async (type = 'default') => {
  const notifyFunctionPair = await notifyFunctionPairs.find((pair) => pair.type === type)
  if (!notifyFunctionPair) {
    throw new Error('Wrong parameters: [type]')
  }
  const { sendNotify, getPipelineJobInfos } = notifyFunctionPair
  const pipelineJobInfos = await getPipelineJobInfos()
  const content = getContent(pipelineJobInfos)

  sendNotify({ mentionedEmailList: pipelineJobInfos.userEmailList, content })
}
