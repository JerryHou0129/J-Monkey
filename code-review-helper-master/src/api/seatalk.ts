import { AxiosResponse } from 'axios'
import { defaultAxios } from '@/utils/http'
import type { SendTextMessageRequest, SendTextMessageResponse } from '@/model/seatalk/systemAccount'

export const sendMessage = (botWebhook: string, data: SendTextMessageRequest) =>
  defaultAxios
    .post<SendTextMessageResponse, AxiosResponse<SendTextMessageResponse>, SendTextMessageRequest>(botWebhook, data)
    .then((axiosResponse) => axiosResponse.data)
