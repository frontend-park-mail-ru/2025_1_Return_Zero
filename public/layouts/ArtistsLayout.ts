
import { Component } from '../libs/Component.ts';
import { State } from '../libs/State.ts';
import Router, { Routable, CallbackData } from '../libs/Router.ts';
import { routes } from '../routes';

import { ArtistsPage } from '../pages/artists/artists.ts';
import { ArtistPage } from 'pages/artist/artist';

import './layout.scss';

export class ArtistsLayout extends Component implements Routable {
    page: State<Component>;

    protected init() {
        this.element.classList.add('artists-layout', 'layout');

        this.page = this.createState(null);
        
        Router.addCallback(routes.artistsRoute, this);
    }

    protected build() {
        Router.callCallback(routes.artistsRoute, this);
    }

    
    protected render(state: State<any>, prev: any, cur: any): void {
        switch (state) {
            case this.page:
                prev && prev.destroy();
                cur && this.element.appendChild(cur.element);
                break;
        }
    }
    
    destroy() {
        super.destroy()

        Router.removeCallback(routes.artistsRoute, this);
    }

    onRoute({path, params}: CallbackData) {
        switch (path) {
            case routes.artistsRoute:
                if (params[1]) {
                    const id = parseInt(params[1])
                    this.page.setState(new ArtistPage(id));
                    break;
                }
                this.page.setState(new ArtistsPage());
        }
    }
}