import { Component } from '../libs/Component.ts';
import { State } from '../libs/State.ts';
import Router, { Routable, CallbackData } from '../libs/Router.ts';
import { routes } from '../utils/routes';

import { ArtistsPage } from '../pages/artists/artists.ts';
import { ArtistPage } from 'pages/artist/artist';
import { NotFound } from 'components/not-found-message/notFound';
import { API } from 'utils/api';

import './layout.scss';

export class ArtistsLayout extends Component implements Routable {
    page: State<Component>;

    protected init() {
        this.element.classList.add('layout', 'layout--artists');

        this.page = this.createState(null);

        Router.addCallback(routes.artistsRoute, this);
    }

    protected build() {
        Router.callCallback(routes.artistsRoute, this);
    }

    protected render(state: State<any>, prev: any, cur: any): void {
        this.element.innerHTML = '';

        switch (state) {
            case this.page:
                prev && prev.destroy();
                cur && this.element.appendChild(cur.element);
                break;
        }
    }

    destroy() {
        super.destroy();

        Router.removeCallback(routes.artistsRoute, this);
    }

    onRoute({ route, params }: CallbackData) {
        switch (route) {
            case routes.artistsRoute:
                if (params[1]) {
                    (async () => {
                        try {
                            (await API.getArtist(parseInt(params[1]))).body;
                        } catch (error) {
                            const notFound = new NotFound();
                            this.element.innerHTML = notFound.element.outerHTML;
                            throw new Error('404 User not Found');
                        }
                    })();

                    const id = parseInt(params[1]);
                    this.page.setState(new ArtistPage(id));
                    break;
                }
                this.page.setState(new ArtistsPage());
        }
    }
}
