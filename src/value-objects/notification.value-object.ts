import z from "zod";

export class Notification {
    static levelSchema = z.enum(['info', 'warning', 'error'])

    static modelSchema = z.object({
        level: Notification.levelSchema,
        seen: z.boolean(),
        title: z.string().nonempty(),
        message: z.string().nonempty()
    })

    private constructor(private readonly modelData: NotificationModel) { }

    static create = (modelData: NotificationModel) => {
        return new Notification(
            Notification.modelSchema.parse(modelData)
        )
    }

    model = (): NotificationModel => {
        return this.modelData
    }

    critical = () => {
        return !this.modelData.seen && this.modelData.level === 'error'
    }

    new = () => {
        return !this.modelData.seen
    }

    read = () => {
        const model = this.model()
        model.seen = true
        return Notification.create(model)
    }
}

export type NotificationModel = z.infer<typeof Notification.modelSchema>

export type NotificationLevel = z.infer<typeof Notification.levelSchema>