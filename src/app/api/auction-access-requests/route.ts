import * as Post from './post'

export const POST = Post.handler

export type AuctionAccessRequestsAPI = {
    POST: Post.Method
}