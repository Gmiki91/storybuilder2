import {Level} from "./LanguageLevel"

export type Story = {
    _id:string;
    title: string;
    description: string;
    language: string;
    level: Level;
    authorId: string;
    rating: {
        positive:number,
        total:number,
        average:number
    }
    updatedAt: Date;
    openEnded: boolean;
    pageIds: string[];
    pendingPageIds: string[]
}