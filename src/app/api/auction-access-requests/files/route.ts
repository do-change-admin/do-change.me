import * as Post from './post'

export const runtime = 'edge'; // обязательно для Vercel Blob

export const POST = Post.handler

export type AuctionAccessRequestsFilesAPI = {
    POST: Post.Method
}