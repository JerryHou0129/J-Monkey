import { defaultAxios } from '@/utils/http'
import { Staff } from '@/model/hr/staff'

export function searchStaffByKeyword(keyword: string) {
  return defaultAxios
    .get<Staff[]>(`https://auth.shopee.io/api/v1/users?keyword=${keyword}`)
    .then((axiosResponse) => axiosResponse.data)
}
