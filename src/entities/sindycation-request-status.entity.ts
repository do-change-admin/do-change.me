import z from "zod";

export class SyndicationRequestStatus {
    static nameSchema = z.enum([
        'draft',
        'pending publisher',
        'active',
        'pending sales',
        'sold'
    ])

    static activeStatusesNameSchema = SyndicationRequestStatus.nameSchema.exclude(['draft'])

    private constructor(private readonly status: SyndicationRequestStatusNames) {

    }

    static create = (status: SyndicationRequestStatusNames) => {
        return new SyndicationRequestStatus(
            SyndicationRequestStatus.nameSchema.parse(status)
        )
    }

    model = (): SyndicationRequestStatusModel => {
        return {
            status: this.status,
            isPublished: SyndicationRequestStatus.activeStatusesNameSchema.safeParse(this.status).success,
        }
    }
}

export type SyndicationRequestStatusNames = z.infer<typeof SyndicationRequestStatus.nameSchema>

export type SyndicationRequestActiveStatusNames = z.infer<typeof SyndicationRequestStatus.activeStatusesNameSchema>

export type SyndicationRequestStatusModel = {
    status: SyndicationRequestStatusNames,
    isPublished: boolean,
}
