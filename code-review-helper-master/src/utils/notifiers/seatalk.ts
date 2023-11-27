import { sendMessage } from '@/api/seatalk'
import { NotifyOption } from '@/model/seatalk/notify'

export function seatalkNotify(options: NotifyOption) {
  const { content, mentionedEmailList } = options
  const botWebhook = process.env.CR_NOTIFY_ROBOT_WEBHOOK
  if (!botWebhook) {
    throw new Error('botWebhook is not injected, please set env for process: CR_NOTIFY_ROBOT_WEBHOOK')
  }
  return sendMessage(botWebhook, {
    tag: 'text',
    text: {
      content,
      mentioned_list: [],
      mentioned_email_list: mentionedEmailList,
      at_all: false,
    },
  })
}
