import { Component, inject, OnInit } from '@angular/core';
import { MediaService } from '../media.service';
import { ActivatedRoute } from '@angular/router';
import { Episode, Media } from '../model/media';
import { catchError, EMPTY, filter, map, mergeMap, tap } from 'rxjs';

@Component({
    selector: 'app-media-details',
    imports: [],
    templateUrl: './media-details.html',
    styleUrl: './media-details.css',
})
export class MediaDetails implements OnInit {
    mediaService = inject(MediaService);
    activatedRoute = inject(ActivatedRoute);
    media: Media | undefined;
    id: string | null = null;
    seasons: number[] | null = null;
    currentSeason = 1;
    episodes: Episode[] | undefined;
    loading = false;

    ngOnInit(): void {
        this.activatedRoute.paramMap
            .pipe(
                map((paramMap) => paramMap.get('id')),
                filter((id) => id != null),
                tap(() => (this.loading = true)),
                mergeMap((id) =>
                    this.mediaService.getMediaById(id, 'full').pipe(
                        map((media) => ({ id, media })),
                        catchError((error) => {
                            this.loading = false;
                            console.log(error);
                            return EMPTY;
                        })
                    )
                )
            )
            .subscribe(({ id, media }) => {
                this.loading = false;
                this.media = media;
                this.id = id;
                this.seasons = Array.from(
                    { length: +media.totalSeasons },
                    (_, i) => i + 1
                );
                this.onChangeSeason(1);
            });
    }

    onChangeSeason(season: number) {
        this.currentSeason = season;
        this.mediaService
            .getEpisodes(this.id!, season)
            .subscribe((episodes) => (this.episodes = episodes));
    }
}
