import { getCIPredefinedVariables } from '@/utils/gitlab/getCIPredefinedVariable'
import { gitlabAxios } from '@/utils/http'
import {
  GitlabFullUser,
  GitlabMergeRequestApprovals,
  GitlabMergeRequestChangesInfo,
  GitlabMergeRequestInfo,
  GitlabMergeRequestNote,
  GitlabMergeRequestNoteParams,
  GitlabPipelineJob,
  JobScope,
  MergeRequestState,
} from '@/model/gitlab/gitlabOpenAPIModel'

export function getMergeRequestInfo(innerId?: number | undefined) {
  const { project, mergeRequest } = getCIPredefinedVariables()
  const uri = `/projects/${project.id}/merge_requests/${innerId ?? mergeRequest.innerId}`
  return gitlabAxios.get<GitlabMergeRequestInfo>(uri).then((axiosResponse) => axiosResponse.data)
}

export function getMergeRequestChangesInfo() {
  const { project, mergeRequest } = getCIPredefinedVariables()
  const uri = `/projects/${project.id}/merge_requests/${mergeRequest.innerId}/changes`
  return gitlabAxios.get<GitlabMergeRequestChangesInfo>(uri).then((axiosResponse) => axiosResponse.data)
}

export function getUserInfo(id: string) {
  return gitlabAxios.get<GitlabFullUser>(`/users/${id}`).then((axiosResponse) => axiosResponse.data)
}

export function getPipelineJobs(scope?: JobScope) {
  const { project, pipeline } = getCIPredefinedVariables()
  const queryParams = new URLSearchParams()
  if (scope) {
    queryParams.append('scope', scope)
  }
  return gitlabAxios
    .get<GitlabPipelineJob[]>(`/projects/${project.id}/pipelines/${pipeline.id}/jobs?${queryParams.toString()}`)
    .then((axiosResponse) => axiosResponse.data)
}

export function getMergeRequestNotes(params: GitlabMergeRequestNoteParams) {
  const { merge_request_iid: mergeRequestInnerId, sort, order_by: orderBy } = params
  const queryParams = new URLSearchParams()
  if (sort) {
    queryParams.append('sort', sort)
  }
  if (orderBy) {
    queryParams.append('order_by', orderBy)
  }
  const { project } = getCIPredefinedVariables()
  return gitlabAxios
    .get<GitlabMergeRequestNote[]>(
      `/projects/${project.id}/merge_requests/${mergeRequestInnerId}/notes?${queryParams.toString()}`,
    )
    .then((axiosResponse) => axiosResponse.data)
}

export function getProjectMergeRequests(state?: MergeRequestState) {
  const { project } = getCIPredefinedVariables()
  return gitlabAxios
    .get<GitlabMergeRequestInfo[]>(`/projects/${project.id}/merge_requests${state ? `?state=${state}` : ''}`)
    .then((axiosResponse) => axiosResponse.data)
}

export function getMergeRequestApprovals(mergeRequestInnerId: string) {
  const { project } = getCIPredefinedVariables()
  return gitlabAxios
    .get<GitlabMergeRequestApprovals>(`/projects/${project.id}/merge_requests/${mergeRequestInnerId}/approvals`)
    .then((axiosResponse) => axiosResponse.data)
}
