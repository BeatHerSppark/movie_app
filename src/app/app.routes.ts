import { Routes } from '@angular/router';
import { Search } from './search/search';
import { MediaDetails } from './media-details/media-details';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
    {
        path: 'search',
        component: Search,
    },
    {
        path: 'title/:id',
        component: MediaDetails,
    },
    {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full',
    },
    {
        path: '**',
        component: NotFound,
    },
];
