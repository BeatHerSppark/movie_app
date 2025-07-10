import { Component, inject, OnInit } from '@angular/core';
import { MediaService } from '../media.service';
import { ActivatedRoute } from '@angular/router';
import { Episode, Media } from '../model/media';
import { filter, map, mergeMap } from 'rxjs';

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

    ngOnInit(): void {
        this.activatedRoute.paramMap
            .pipe(
                map((paramMap) => paramMap.get('id')),
                filter((id) => id != null),
                mergeMap((id) =>
                    this.mediaService
                        .getMediaById(id, 'full')
                        .pipe(map((media) => ({ id, media })))
                )
            )
            .subscribe(({ id, media }) => {
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
            .pipe(map((episodes) => episodes))
            .subscribe((episodes) => (this.episodes = episodes));
    }
}
