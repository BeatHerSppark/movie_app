import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Media } from '../model/media';

@Component({
    selector: 'search-card',
    imports: [RouterLink],
    templateUrl: './search-card.html',
    styleUrl: './search-card.css',
})
export class SearchCard {
    @Input() media: Media | undefined;
}
