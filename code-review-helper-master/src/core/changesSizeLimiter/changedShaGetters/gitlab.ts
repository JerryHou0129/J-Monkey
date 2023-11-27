import { getMergeRequestChangesInfo } from '@/api/gitlab'

export async function changedShaGetters() {
  const mergeRequestChangesInfo = await getMergeRequestChangesInfo()
  const { diff_refs: diffRefs, title } = mergeRequestChangesInfo
  const { base_sha: baseSha, head_sha: headSha } = diffRefs
  const shouldSkip = title.includes('--skip-mr-size-limit')

  return {
    baseSha,
    headSha,
    shouldSkip,
  }
}
