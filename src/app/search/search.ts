import { Component, HostListener, inject, OnInit } from '@angular/core';
import { MediaService } from '../media.service';
import {
    BehaviorSubject,
    debounceTime,
    distinctUntilChanged,
    Observable,
    of,
    Subject,
    switchMap,
    tap,
} from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SearchCard } from '../search-card/search-card';
import { SearchCardMedia } from '../model/searchCardMedia';

@Component({
    selector: 'media-search',
    imports: [AsyncPipe, SearchCard],
    templateUrl: './search.html',
    styleUrl: './search.css',
})
export class Search implements OnInit {
    mediaService = inject(MediaService);
    result$ = new BehaviorSubject<SearchCardMedia[]>([]);
    query$ = new Subject<string>();
    totalSearchResults$: Observable<number | null> = of(null);
    queryValue: string = '';
    loading = false;
    page = 1;

    ngOnInit(): void {
        this.query$
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                tap(() => (this.loading = true)),
                switchMap((query) => {
                    if (query) {
                        this.queryValue = query;
                        this.totalSearchResults$ =
                            this.mediaService.getTotalSearchResults(query);
                        return this.mediaService.search(query, this.page);
                    } else {
                        this.totalSearchResults$ = of(null);
                        this.loading = false;
                        return of([]);
                    }
                }),
                tap((results) => {
                    this.result$.next(results);
                    this.loading = false;
                })
            )
            .subscribe();
    }

    onSearch(query: string) {
        this.query$.next(query);
    }

    @HostListener('window:scroll', [])
    onScrollBottom() {
        const threshold = 100;
        const position = window.innerHeight + window.scrollY;
        const height = document.documentElement.scrollHeight;

        if (position >= height - threshold && !this.loading) {
            this.loading = true;
            this.page++;

            this.mediaService
                .search(this.queryValue, this.page)
                .pipe(
                    tap((newResults) => {
                        this.result$.next([
                            ...this.result$.value,
                            ...newResults,
                        ]);
                        this.loading = false;
                    })
                )
                .subscribe();
        }
    }
}
