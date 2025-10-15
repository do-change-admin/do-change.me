import { ValueObjects } from "@/value-objects"

export type Interface = {
    send(email: ValueObjects.EmailMessage.Model): ValueObjects.Response.Provider
}