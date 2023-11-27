/**
 * pack and classify predefined variables to an object
 * see docs: https://docs.gitlab.com/13.12/ee/ci/variables/predefined_variables.html
 */
export function getCIPredefinedVariables() {
  const ciApiV4URL = process.env.CI_API_V4_URL
  const personalToken = process.env.PERSONAL_TOKEN

  const projectId = process.env.CI_PROJECT_ID
  const projectName = process.env.CI_PROJECT_NAME
  const projectNamespace = process.env.CI_PROJECT_NAMESPACE
  const projectUrl = process.env.CI_PROJECT_URL

  const commitDescription = process.env.CI_COMMIT_DESCRIPTION
  const commitMessage = process.env.CI_COMMIT_MESSAGE
  const commitTimestamp = process.env.CI_COMMIT_TIMESTAMP
  const commitTitle = process.env.CI_COMMIT_TITLE

  const mergeRequestAssignees = (process.env.CI_MERGE_REQUEST_ASSIGNEES ?? '').split(',')
  const mergeRequestId = process.env.CI_MERGE_REQUEST_ID
  const mergeRequestInnerId = process.env.CI_MERGE_REQUEST_IID
  const mergeRequestProjectId = process.env.CI_MERGE_REQUEST_PROJECT_ID
  const mergeRequestProjectUrl = process.env.CI_MERGE_REQUEST_PROJECT_URL
  const mergeRequestSourceProjectId = process.env.CI_MERGE_REQUEST_SOURCE_PROJECT_ID
  const mergeRequestSourceProjectUrl = process.env.CI_MERGE_REQUEST_SOURCE_PROJECT_URL
  const mergeRequestSourceBranchName = process.env.CI_MERGE_REQUEST_SOURCE_BRANCH_NAME
  const mergeRequestTargetBranchName = process.env.CI_MERGE_REQUEST_TARGET_BRANCH_NAME
  const mergeRequestTitle = process.env.CI_MERGE_REQUEST_TITLE
  const mergeRequestEventType = process.env.CI_MERGE_REQUEST_EVENT_TYPE
  const mergeRequestDiffId = process.env.CI_MERGE_REQUEST_DIFF_ID

  const pipelineId = process.env.CI_PIPELINE_ID

  return {
    meta: {
      gitLabOpenApiBaseURL: ciApiV4URL,
      personalToken,
    },
    project: {
      id: projectId,
      name: projectName,
      namespace: projectNamespace,
      url: projectUrl,
    },
    commit: {
      message: commitMessage,
      description: commitDescription,
      timestamp: commitTimestamp,
      title: commitTitle,
    },
    mergeRequest: {
      title: mergeRequestTitle,
      assignees: mergeRequestAssignees,
      id: mergeRequestId,
      innerId: mergeRequestInnerId,
      projectId: mergeRequestProjectId,
      projectUrl: mergeRequestProjectUrl,
      sourceProjectId: mergeRequestSourceProjectId,
      sourceProjectUrl: mergeRequestSourceProjectUrl,
      sourceBranchName: mergeRequestSourceBranchName,
      targetBranchName: mergeRequestTargetBranchName,
      eventType: mergeRequestEventType,
      diffId: mergeRequestDiffId,
    },
    pipeline: {
      id: pipelineId,
    },
  }
}
