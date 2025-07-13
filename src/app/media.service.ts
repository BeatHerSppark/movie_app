import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { filter, forkJoin, map, mergeMap, Observable, switchMap } from 'rxjs';
import { Media } from './model/media';
import { env } from './env';
import { SearchResponse } from './model/searchResponse';
import { EpisodeResponse } from './model/episodeResponse';
import { Person } from './model/person';
import { Episode } from './model/episode';
import { SearchCardMedia } from './model/searchCardMedia';

@Injectable({ providedIn: 'root' })
export class MediaService {
    http = inject(HttpClient);
    httpHeaders = new HttpHeaders({
        Accept: 'application/json',
        Authorization: `Bearer ${env.apiKeyTMDB}`,
    });
    url = `https://www.omdbapi.com/?apikey=${env.apiKey}&`;
    actorUrl =
        'https://api.themoviedb.org/3/search/person?page=1&include_adult=false&query=';

    search(query: string, page: number): Observable<SearchCardMedia[]> {
        return this.http
            .get<SearchResponse>(`${this.url}s=${query}&page=${page}`)
            .pipe(
                filter((res) => !!res.Search),
                mergeMap((res) => {
                    const ids = res.Search.map((media) => media.imdbID);
                    const requests = ids.map((id) =>
                        this.getSearchCardById(id)
                    );
                    return forkJoin(requests);
                })
            );
    }

    getTotalSearchResults(query: string): Observable<number> {
        return this.http.get<SearchResponse>(`${this.url}s=${query}`).pipe(
            filter((res) => !!res.totalResults),
            map((res) => +res.totalResults)
        );
    }

    getSearchCardById(id: string): Observable<SearchCardMedia> {
        return this.http.get<any>(`${this.url}i=${id}`).pipe(
            map((media) => {
                if (media.Response == 'False') throw new Error(media.Error);

                return {
                    imdbID: media.imdbID,
                    title: media.Title,
                    released: media.Released,
                    runtime: media.Runtime,
                    genres: media.Genre.split(', '),
                    plot: media.Plot,
                    poster: media.Poster,
                    rating: media.imdbRating,
                    totalSeasons: media?.totalSeasons,
                };
            })
        );
    }

    getMediaById(id: string, plot: string): Observable<Media> {
        return this.http.get<any>(`${this.url}i=${id}&plot=${plot}`).pipe(
            switchMap((media) => {
                if (media.Response == 'False') throw new Error(media.Error);

                const actorNames = media.Actors.split(', ');

                const actorRequests: Observable<Person>[] = actorNames.map(
                    (actor: string) => this.getPersonByName(actor)
                );

                return forkJoin(actorRequests).pipe(
                    map((actorObjects: Person[]) => ({
                        imdbID: media.imdbID,
                        title: media.Title,
                        year: media.Year,
                        rated: media.Rated,
                        released: media.Released,
                        runtime: media.Runtime,
                        genres: media.Genre.split(', '),
                        director: media.Director,
                        writer: media.Writer,
                        actors: actorObjects,
                        plot: media.Plot,
                        awards: media.Awards,
                        poster: media.Poster,
                        rating: media.imdbRating,
                        totalSeasons: media?.totalSeasons,
                    }))
                );
            })
        );
    }

    getEpisodes(id: string, season: number): Observable<Episode[]> {
        return this.http
            .get<EpisodeResponse>(`${this.url}i=${id}&season=${season}`)
            .pipe(map((res) => res.Episodes));
    }

    getPersonByName(name: string): Observable<Person> {
        return this.http
            .get<any>(`${this.actorUrl}${name}`, { headers: this.httpHeaders })
            .pipe(
                map((res) => {
                    const person = res.results[0];
                    return {
                        name: person.name,
                        image: person.profile_path,
                    };
                })
            );
    }

    formattedActors(actors: string): string[] {
        return actors
            .split(', ')
            .map((actor) => actor.toLowerCase().split(' ').join('+'));
    }
}
