// see https://static.cdn.haiserve.com/seatalk/client/shared/notice_bot/guidelines.html

export interface SendTextMessageRequest {
  tag: 'text'
  text: {
    content: string
    mentioned_list: string[]
    mentioned_email_list: string[]
    at_all: boolean
  }
}

export interface SendTextMessageResponse {
  code: number
  message: string
}

export interface SendImageMessageRequest {
  tag: 'image'
  image_base64: {
    content: string
  }
}
