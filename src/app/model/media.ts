import { Person } from './person';

export interface Media {
    imdbID: string;
    title: string;
    year: string;
    rated: string;
    released: string;
    runtime: string;
    genres: string[];
    director: string;
    writer: string;
    actors: Person[];
    plot: string;
    awards: string;
    poster: string;
    rating: string;
    totalSeasons: string;
}
