import {Level} from "./LanguageLevel"

type Page = {
    number: number;
    id: string;
}

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
    pages: Page[];
    pendingPageIds: string[]
}