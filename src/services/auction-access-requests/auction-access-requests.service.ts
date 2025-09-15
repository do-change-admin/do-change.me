import { PaginationSchemaType } from "@/schemas";
import { AuctionAccessRequestListItem, AuctionAccessRequestStatus } from './types'

type FindListQueryData = PaginationSchemaType & { status: AuctionAccessRequestStatus }

export class AuctionAccessRequestsService {
    findRequests = async (query: FindListQueryData): Promise<AuctionAccessRequestListItem[]> => {
        return []
    }
}