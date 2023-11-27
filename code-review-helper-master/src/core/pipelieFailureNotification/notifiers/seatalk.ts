import { NotifyOption } from '@/model/seatalk/notify'
import { seatalkNotify } from '@/utils/notifiers/seatalk'

export function notify(options: NotifyOption) {
  seatalkNotify(options)
}
