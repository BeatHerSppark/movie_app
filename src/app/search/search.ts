import { Component, inject, OnInit } from '@angular/core';
import { MediaService } from '../media.service';
import {
    debounceTime,
    distinctUntilChanged,
    Observable,
    of,
    Subject,
    switchMap,
    tap,
} from 'rxjs';
import { Media } from '../model/media';
import { AsyncPipe } from '@angular/common';
import { SearchCard } from '../search-card/search-card';

@Component({
    selector: 'media-search',
    imports: [AsyncPipe, SearchCard],
    templateUrl: './search.html',
    styleUrl: './search.css',
})
export class Search implements OnInit {
    mediaService = inject(MediaService);
    result$: Observable<Media[]> | undefined;
    query$ = new Subject<string>();
    loading = false;

    ngOnInit(): void {
        this.result$ = this.query$.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            tap(() => this.loading = true),
            switchMap((query) => {
                if (query) {
                    return this.mediaService.search(query).pipe(
                        tap(() => this.loading = false)
                    );
                } else {
                    this.loading = false;
                    return of([]);
                }
            }),
        );
    }

    onSearch(query: string) {
        this.query$.next(query);
    }
}
