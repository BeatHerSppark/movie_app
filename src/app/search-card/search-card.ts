import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SearchCardMedia } from '../model/searchCardMedia';

@Component({
    selector: 'search-card',
    imports: [RouterLink],
    templateUrl: './search-card.html',
    styleUrl: './search-card.css',
})
export class SearchCard {
    @Input() media: SearchCardMedia | undefined;
}
