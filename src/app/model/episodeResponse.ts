import { Episode } from './media';

export interface EpisodeResponse {
    Title: string;
    Season: string;
    totalSeasons: string;
    Episodes: Episode[];
    Response: string;
}
