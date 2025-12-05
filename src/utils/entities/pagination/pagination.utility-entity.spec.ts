import { beforeEach, expect, test } from 'vitest';
import { Pagination } from './pagination.utility-entity';

let pagination: Pagination;

beforeEach(() => {
    pagination = Pagination.createFromRawModel({
        pageSize: '10',
        zeroBasedIndex: '1'
    });
});

test('Previous page', () => {
    const previousPage = pagination.previousPage;
    expect(previousPage.model.pageSize).toBe(10);
    expect(previousPage.model.zeroBasedIndex).toBe(0);

    const nextPreviousPage = previousPage.previousPage;
    expect(nextPreviousPage.model.pageSize).toBe(10);
    expect(nextPreviousPage.model.zeroBasedIndex).toBe(0);
});

test('Basic data after creation', () => {
    expect(pagination.model.pageSize).toBe(10);
    expect(pagination.model.zeroBasedIndex).toBe(1);
});

test('Next page', () => {
    const nextPage = pagination.nextPage;
    expect(nextPage.model.pageSize).toBe(10);
    expect(nextPage.model.zeroBasedIndex).toBe(2);
});
