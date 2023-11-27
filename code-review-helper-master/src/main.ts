import 'source-map-support/register'
import { notifyAssignees } from '@/core/mergeRequestCreatedNotifier'
import { changesSizeLimit } from '@/core/changesSizeLimiter'
import { pipelineFailureNotification } from '@/core/pipelieFailureNotification'
import { mergeRequestStatusNotifier } from '@/core/mergeRequestStatusNotifier'
export { notifyAssignees } from '@/core/mergeRequestCreatedNotifier'

export const codeReviewHelper = async (toolName: string, stopWhenError: string, ...restArguments: string[]) => {
  const toolMap: Record<string, (...toolArguments: string[]) => unknown | Promise<unknown>> = {
    notifyAssignees,
    changesSizeLimit,
    pipelineFailureNotification,
    mergeRequestStatusNotifier,
  }

  try {
    await toolMap[toolName](...restArguments)
  } catch (e) {
    if (e instanceof Error) {
      console.error(e)
      if (stopWhenError === 'true') {
        process.exit(-1)
      } else {
        process.exit(0)
      }
    }
  }
}
