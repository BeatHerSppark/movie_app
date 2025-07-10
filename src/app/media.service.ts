import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { filter, forkJoin, map, mergeMap, Observable } from 'rxjs';
import { Episode, Media } from './model/media';
import { env } from './env';
import { SearchResponse } from './model/searchResponse';
import { EpisodeResponse } from './model/episodeResponse';

@Injectable({ providedIn: 'root' })
export class MediaService {
    http = inject(HttpClient);
    url = `https://www.omdbapi.com/?apikey=${env.apiKey}&`;

    search(query: string): Observable<Media[]> {
        return this.http.get<SearchResponse>(`${this.url}s=${query}`).pipe(
            map((res) => res.Search),
            filter((search) => search != null),
            mergeMap((search) => {
                const ids = search.map((media) => media.imdbID);
                const requests = ids.map((id) =>
                    this.getMediaById(id, 'short')
                );
                return forkJoin(requests);
            })
        );
    }

    getMediaById(id: string, plot: string): Observable<Media> {
        return this.http.get<any>(`${this.url}i=${id}&plot=${plot}`).pipe(
            map((media) => ({
                imdbID: media.imdbID,
                title: media.Title,
                year: media.Year,
                rated: media.Rated,
                released: media.Released,
                runtime: media.Runtime,
                genres: media.Genre.split(', '),
                director: media.Director,
                writer: media.Writer,
                actors: media.Actors.split(', '),
                plot: media.Plot,
                awards: media.Awards,
                poster: media.Poster,
                rating: media.imdbRating,
                totalSeasons: media?.totalSeasons,
            }))
        );
    }

    getEpisodes(id: string, season: number): Observable<Episode[]> {
        return this.http
            .get<EpisodeResponse>(`${this.url}i=${id}&season=${season}`)
            .pipe(map((res) => res.Episodes));
    }
}
