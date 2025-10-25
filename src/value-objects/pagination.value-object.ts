import z from "zod";

export class Pagination {
    static rawSchema = z.object({
        zeroBasedIndex: z.union([z.string(), z.number()]),
        pageSize: z.union([z.string(), z.number()])
    })

    private constructor(
        private readonly zeroBasedIndex: number,
        private readonly pageSize: number
    ) { }

    static create = (rawModel: PaginationRawModel) => {
        const zeroBasedIndex = z.coerce.number().int().nonnegative().parse(rawModel.zeroBasedIndex)
        const pageSize = z.coerce.number().positive().parse(rawModel.pageSize)
        return new Pagination(zeroBasedIndex, pageSize)
    }

    same = (pagination: Pagination) => {
        return pagination.pageSize === this.pageSize
            && pagination.zeroBasedIndex === this.zeroBasedIndex
    }

    get model(): PaginationModel {
        return {
            pageSize: this.pageSize,
            zeroBasedIndex: this.zeroBasedIndex
        }
    }

    get nextPage() {
        return Pagination.create({
            pageSize: this.pageSize,
            zeroBasedIndex: this.zeroBasedIndex + 1
        })
    }

    get previousPage() {
        if (this.zeroBasedIndex === 0) {
            return Pagination.create(this.model);
        }

        return Pagination.create({
            pageSize: this.pageSize,
            zeroBasedIndex: this.zeroBasedIndex - 1
        })
    }
}

export type PaginationModel = {
    zeroBasedIndex: number;
    pageSize: number;
}

export type PaginationRawModel = z.infer<typeof Pagination.rawSchema>