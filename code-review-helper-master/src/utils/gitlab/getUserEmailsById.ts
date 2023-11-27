import { getUserInfo } from '@/api/gitlab'
import { searchStaffByKeyword } from '@/api/hr'

export async function getUserEmailById(id: string) {
  const userInfo = await getUserInfo(id)
  const { public_email: email } = userInfo
  if (email) {
    return [email]
  }

  const { username } = userInfo
  let staffList = []
  try {
    staffList = await searchStaffByKeyword(username)
  } catch (e) {
    console.error(e)
    staffList = [{ email: `${username}@shopee.com` }]
  }
  return staffList.map((staff) => staff.email)
}
