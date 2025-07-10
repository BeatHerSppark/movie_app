export interface SearchMedia {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
}

export interface SearchResponse {
    Search: SearchMedia[];
    totalResults: string;
    Response: string;
}
