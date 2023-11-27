export interface GitlabUser {
  id: number
  name: string
  username: string
  state: string
  avatar_url: string
  web_url: string
}

export interface GitlabFullUser extends GitlabUser {
  created_at: Date
  bio: string
  bot: boolean
  location?: unknown
  public_email: string
  skype: string
  linkedin: string
  twitter: string
  website_url: string
  organization: string
  job_title: string
  followers: number
  following: number
}

export interface GitlabReferences {
  short: string
  relative: string
  full: string
}

export interface GitlabTimeStats {
  time_estimate: number
  total_time_spent: number
  human_time_estimate?: unknown
  human_total_time_spent?: unknown
}

export interface GitlabTaskCompletionStatus {
  count: number
  completed_count: number
}

export enum GitlabPipelineStatus {
  CREATED = 'created',
  WAITING_FOR_RESOURCE = 'waiting_for_resource',
  PREPARING = 'preparing',
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELED = 'canceled',
  SKIPPED = 'skipped',
  MANUAL = 'manual',
  SCHEDULED = 'scheduled',
}

export interface GitlabPipeline {
  id: number
  sha: string
  ref: string
  status: GitlabPipelineStatus
  created_at: Date
  updated_at: Date
  web_url: string
}

export interface GitlabPipelineDetailedStatus {
  icon: string
  text: string
  label: string
  group: string
  tooltip: string
  has_details: boolean
  details_path: string
  illustration?: unknown
  favicon: string
}

export interface GitlabHeadPipeline extends GitlabPipeline {
  before_sha: string
  tag: boolean
  yaml_errors?: unknown
  user: GitlabUser
  started_at: Date
  finished_at: Date
  committed_at?: Date
  duration: number
  coverage?: unknown
  detailed_status: GitlabPipelineDetailedStatus
}

export interface GitlabDiffRefs {
  base_sha: string
  head_sha: string
  start_sha: string
}

export interface GitlabApprovalInfo {
  can_merge: boolean
}

export interface GitlabChange {
  old_path: string
  new_path: string
  a_mode: string
  b_mode: string
  new_file: boolean
  renamed_file: boolean
  deleted_file: boolean
  diff: string
}

export interface GitlabMergeRequestInfo {
  id: number
  iid: number
  project_id: number
  title: string
  description?: string
  state: string
  created_at: Date
  updated_at: Date
  merged_by?: GitlabUser
  merged_at?: Date
  closed_by?: GitlabUser
  closed_at?: Date
  target_branch: string
  source_branch: string
  user_notes_count: number
  upvotes: number
  downvotes: number
  author: GitlabUser
  assignees: GitlabUser[]
  assignee?: GitlabUser
  source_project_id: number
  target_project_id: number
  labels: string[]
  work_in_progress: boolean
  milestone?: string
  merge_when_pipeline_succeeds: boolean
  merge_status: string
  sha: string
  merge_commit_sha?: string
  squash_commit_sha?: string
  discussion_locked?: null
  should_remove_source_branch?: boolean
  force_remove_source_branch: boolean
  reference: string
  references: GitlabReferences
  web_url: string
  time_stats: GitlabTimeStats
  squash: boolean
  task_completion_status: GitlabTaskCompletionStatus
  has_conflicts: boolean
  blocking_discussions_resolved: boolean
  approvals_before_merge?: boolean
  pipeline: GitlabPipeline
}

export interface GitlabMergeRequestChangesInfo {
  id: number
  iid: number
  project_id: number
  title: string
  description: string
  state: string
  created_at: Date
  updated_at: Date
  merged_by: GitlabUser
  merged_at: Date
  closed_by?: GitlabUser
  closed_at?: Date
  target_branch: string
  source_branch: string
  user_notes_count: number
  upvotes: number
  downvotes: number
  author: GitlabUser
  assignees: GitlabUser[]
  assignee: GitlabUser
  source_project_id: number
  target_project_id: number
  labels: string[]
  work_in_progress: boolean
  milestone?: string
  merge_when_pipeline_succeeds: boolean
  merge_status: string
  sha: string
  merge_commit_sha: string
  squash_commit_sha?: string
  discussion_locked?: unknown
  should_remove_source_branch?: boolean
  force_remove_source_branch: boolean
  reference: string
  references: GitlabReferences
  web_url: string
  time_stats: GitlabTimeStats
  squash: boolean
  task_completion_status: GitlabTaskCompletionStatus
  has_conflicts: boolean
  blocking_discussions_resolved: boolean
  approvals_before_merge?: unknown
  subscribed: boolean
  changes_count: string
  latest_build_started_at: Date
  latest_build_finished_at?: Date
  first_deployed_to_production_at?: Date
  pipeline: GitlabPipeline
  head_pipeline: GitlabHeadPipeline
  diff_refs: GitlabDiffRefs
  merge_error?: unknown
  user: GitlabApprovalInfo
  changes: GitlabChange[]
  overflow: boolean
}

export enum JobScope {
  CREATED = 'created',
  PENDING = 'pending',
  RUNNING = 'running',
  FAILED = 'failed',
  SUCCESS = 'success',
  CANCELED = 'canceled',
  SKIPPED = 'skipped',
  MANUAL = 'manual',
}

export interface GitlabPipelineJob {
  id: number
  name: string
  stage: string
  allow_failure: boolean
  web_url: string
  user: GitlabUser
}

export enum GitlabSortType {
  ASC = 'asc',
  DESC = 'desc',
}

export enum GitlabOrderByType {
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
}

export interface GitlabMergeRequestNoteParams {
  merge_request_iid: number | string
  sort?: GitlabSortType
  order_by?: GitlabOrderByType
}

export interface GitlabMergeRequestNote {
  id: number
  type?: string
  body: string
  author: GitlabUser
  created_at: string
  updated_at: string
  system: boolean
  noteable_id: number
  noteable_type: string
  resolved: boolean
  resolvable: boolean
  attachment?: string
}

export interface GitlabMergeRequestApprovals {
  id: number
  iid: number
  project_id: number
  title: string
  description: string
  state: string
  created_at: string
  updated_at: string
  merge_status: string
  approvals_required: number
  approvals_left: number
  approved_by: GitlabUser[]
  approved: boolean
}

export enum NoteType {
  DIFFNOTE = 'DiffNote',
}

export enum MergeRequestState {
  OPENED = 'opened',
  CLOSED = 'closed',
  LOCKED = 'locked',
  MERGED = 'merged',
}
