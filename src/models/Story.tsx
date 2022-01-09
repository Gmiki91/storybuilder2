import {Level} from "./LanguageLevel"

export type Story = {
    _id?:string;
    title: string;
    description: string;
    language: string;
    targetLevel: Level;
    authorId: string;
    rating: number;
    updatedAt: Date;
    openForSubmissions: boolean;
    pageIds: string[];
    pendingPageIds: string[]
}