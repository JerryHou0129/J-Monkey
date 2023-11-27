import { getMergeRequestInfo } from '@/api/gitlab'
import { MergeRequestInfo } from '@/core/mergeRequestCreatedNotifier/model'
import { getUserEmailById } from '@/utils/gitlab/getUserEmailsById'

export async function mergeRequestInfoGetter(): Promise<MergeRequestInfo> {
  const mergeRequestInfoFromGitlabOpenApi = await getMergeRequestInfo()

  const assigneeIdList = mergeRequestInfoFromGitlabOpenApi.assignees.map((assignee) => `${assignee.id}`)
  if (assigneeIdList.length === 0) {
    throw new Error('Assignee list is empty, please check assignees of merge request and REBUILD this job')
  }

  const assigneeEmails = (await Promise.all(assigneeIdList.map((id) => getUserEmailById(id)))).flat(1)
  const authorUsername = mergeRequestInfoFromGitlabOpenApi.author.username
  const mergeRequestTitle = mergeRequestInfoFromGitlabOpenApi.title
  const mergeRequestURL = mergeRequestInfoFromGitlabOpenApi.web_url
  const mergeRequestDescription = mergeRequestInfoFromGitlabOpenApi.description ?? ''
  const sourceBranch = mergeRequestInfoFromGitlabOpenApi.source_branch
  const targetBranch = mergeRequestInfoFromGitlabOpenApi.target_branch
  const isWIP = mergeRequestInfoFromGitlabOpenApi.work_in_progress

  return {
    title: mergeRequestTitle,
    author: authorUsername,
    description: mergeRequestDescription,
    link: mergeRequestURL,
    sourceBranch,
    targetBranch,
    assigneeEmails,
    isWIP,
  }
}
