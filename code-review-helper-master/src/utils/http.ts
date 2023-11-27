import axios from 'axios'
import { getCIPredefinedVariables } from '@/utils/gitlab/getCIPredefinedVariable'

export const defaultAxios = axios.create()

const { meta } = getCIPredefinedVariables()
export const gitlabAxios = axios.create({
  baseURL: meta.gitLabOpenApiBaseURL,
  headers: {
    'PRIVATE-TOKEN': meta.personalToken ?? '',
  },
})
