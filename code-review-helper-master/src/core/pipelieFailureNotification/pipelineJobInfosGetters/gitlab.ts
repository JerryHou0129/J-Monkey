import { PipelineJobInfos } from '@/core/pipelieFailureNotification/model'
import { getPipelineJobs } from '@/api/gitlab'
import { GitlabPipelineJob, JobScope } from '@/model/gitlab/gitlabOpenAPIModel'
import { getUserEmailById } from '@/utils/gitlab/getUserEmailsById'

export async function getPipelineJobInfos(): Promise<PipelineJobInfos> {
  const pipelineJobs = await getPipelineJobs(JobScope.FAILED)
  const jobInfos = pipelineJobs.map((item: GitlabPipelineJob) => ({ name: item.name, webUrl: item.web_url }))

  const { user } = pipelineJobs[0]
  const userEmailList = await getUserEmailById(`${user.id}`)

  return {
    userEmailList,
    jobInfos,
  }
}
