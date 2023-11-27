export interface MergeRequestInfo {
  author: string
  title: string
  description: string
  link: string
  sourceBranch: string
  targetBranch: string
  assigneeEmails: string[]
  isWIP: boolean
}
