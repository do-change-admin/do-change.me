import z from 'zod';

export class Pagination {
    static rawSchema = z.object({
        zeroBasedIndex: z.union([z.string(), z.number()]),
        pageSize: z.union([z.string(), z.number()])
    });

    static schema = z.object({
        zeroBasedIndex: z.int().nonnegative(),
        pageSize: z.int().positive()
    });

    private constructor(
        private readonly zeroBasedIndex: number,
        private readonly pageSize: number
    ) {}

    static createFromRawModel = (rawModel: PaginationRawModel) => {
        const zeroBasedIndex = z.coerce.number().int().nonnegative().parse(rawModel.zeroBasedIndex);
        const pageSize = z.coerce.number().positive().parse(rawModel.pageSize);
        return new Pagination(zeroBasedIndex, pageSize);
    };

    same = (pagination: Pagination) => {
        return pagination.pageSize === this.pageSize && pagination.zeroBasedIndex === this.zeroBasedIndex;
    };

    get model(): PaginationModel {
        return {
            pageSize: this.pageSize,
            zeroBasedIndex: this.zeroBasedIndex
        };
    }

    static onePageRequest = Pagination.createFromRawModel({
        pageSize: 1000,
        zeroBasedIndex: 0
    }).model;

    get nextPage() {
        return Pagination.createFromRawModel({
            pageSize: this.pageSize,
            zeroBasedIndex: this.zeroBasedIndex + 1
        });
    }

    /**
     * Safe implementation. If it's first page, pagination with the same model is returned.
     */
    get previousPage() {
        if (this.zeroBasedIndex === 0) {
            return Pagination.createFromRawModel(this.model);
        }

        return Pagination.createFromRawModel({
            pageSize: this.pageSize,
            zeroBasedIndex: this.zeroBasedIndex - 1
        });
    }
}

export type PaginationModel = {
    zeroBasedIndex: number;
    pageSize: number;
};

export type PaginationRawModel = z.infer<typeof Pagination.rawSchema>;
