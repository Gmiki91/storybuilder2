export type Page = {
    _id:string
    text: string,
    language: string,
    level: string,
    authorId: string,
    rating: [{ userId: string, rate: number }],
    status: 'Pending' | 'Confirmed',
    translationIds: string[]
}