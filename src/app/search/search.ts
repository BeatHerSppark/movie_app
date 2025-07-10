import { Component, inject, OnInit } from '@angular/core';
import { MediaService } from '../media.service';
import {
    debounceTime,
    distinctUntilChanged,
    Observable,
    of,
    Subject,
    switchMap,
} from 'rxjs';
import { Media } from '../model/media';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'media-search',
    imports: [AsyncPipe, RouterLink],
    templateUrl: './search.html',
    styleUrl: './search.css',
})
export class Search implements OnInit {
    mediaService = inject(MediaService);
    result$: Observable<Media[]> | undefined;
    query$ = new Subject<string>();

    ngOnInit(): void {
        this.result$ = this.query$.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            switchMap((query) => {
                if (query) {
                    return this.mediaService.search(query);
                } else return of([]);
            })
        );
    }

    onSearch(query: string) {
        this.query$.next(query);
    }
}
