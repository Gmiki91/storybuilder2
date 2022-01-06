import { Level } from "../models/LanguageLevel";

export type StorySummary = {
    _id: string;
    title: string;
    description: string;
    language: string;
    level: Level,
    updatedAt: Date;
    rating: number;
}