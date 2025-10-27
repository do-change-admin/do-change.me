import { VO } from "@/value-objects"

export type Interface = {
    send: (email: VO.EmailMessage.Model) => Promise<void>
}