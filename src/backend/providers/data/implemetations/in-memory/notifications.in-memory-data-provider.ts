import { Interface } from '../../contracts/notifications.data-provider'
import { generateInMemoryCRUDProvider } from '../../shared/in-memory.data-provider'

const Notifications = generateInMemoryCRUDProvider<
    Interface
>()

export { Notifications }