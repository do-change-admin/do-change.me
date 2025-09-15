import { PaginationSchemaType } from "@/schemas";
import { AuctionAccessRequestListItem, AuctionAccessRequestStatus } from './types'

type FindListQueryData = PaginationSchemaType & { status: AuctionAccessRequestStatus }

export class AuctionAccessRequestsService {
    findRequestsForAdmin = async (query: FindListQueryData): Promise<AuctionAccessRequestListItem[]> => {
        return [
            {
                id: '1',
                firstName: "Sarah",
                lastName: "Johnson",
                email: "sarah.johnson@email.com",
                birthDate: new Date(1990, 2, 4),
                applicationDate: new Date(),
                photoLink: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg",
                status: query.status
            },
            {
                id: '2',
                firstName: "Michael",
                lastName: "Chen",
                email: "michael.chen@email.com",
                birthDate: new Date(2000, 2, 4),
                applicationDate: new Date(),
                photoLink: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
                status: query.status
            },
            // {
            //     id: '3',
            //     name: "Emily Rodriguez",
            //     email: "emily.rodriguez@email.com",
            //     dob: "December 8, 1992",
            //     date: "April 17, 1991",
            //     avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg"
            // },
            // {
            //     id: '4',
            //     name: "David Wilson",
            //     email: "david.wilson@email.com",
            //     dob: "September 3, 1988",
            //     date: "April 17, 1991",
            //     avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
            // },
            // {
            //     id: '5',
            //     name: "Lisa Thompson",
            //     email: "lisa.thompson@email.com",
            //     dob: "April 17, 1991",
            //     date: "April 17, 1991",
            //     avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg"
            // },
        ];

    }
}