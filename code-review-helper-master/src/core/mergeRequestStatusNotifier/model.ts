import { GitlabMergeRequestInfo } from '@/model/gitlab/gitlabOpenAPIModel'

export enum MrStatusDetail {
  APPROVED = 'approved',
  CR_FINISHED = 'crFinished',
  PENDING = 'pending',
  TIMEOUT = 'timeout',
  RESOLVED = 'resolved',
  WIP_OR_DRAFT = 'wipOrDraft',
  PIPELINE_FAILED = 'pipelineFailed',
}

export interface StatefulMergeRequestInfo extends GitlabMergeRequestInfo {
  statusDetail?: MrStatusDetail
}

export interface ReceiversToMRInfoMap {
  [gitlabUserId: string]: StatefulMergeRequestInfo[]
}
