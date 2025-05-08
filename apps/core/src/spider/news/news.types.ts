import { News } from "@prisma/client";

export interface NewsQuery {}

export interface NewsItem extends Partial<News> {}
