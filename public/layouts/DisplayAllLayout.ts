import { Component } from 'libs/Component.ts';
import { State } from 'libs/State.ts';
import Router, { Routable, CallbackData } from 'libs/Router.ts';

import { routes } from 'utils/routes';

import { NotFound } from 'components/not-found-message/notFound';
import { DisplayAllHistory, DisplayAllRecommendations } from 'components/DisplayAll/DisplaysAllTracks';
import { DisplayAllAlbums } from 'components/DisplayAll/DisplaysAllAlbums';
import { DisplayAllArtists } from 'components/DisplayAll/DisplaysAllArtists';

export class DisplayAllLayout extends Component implements Routable {
    child: State<Component>;

    protected init() {
        this.element.classList.add('layout');
        this.child = this.createState(null);

        Router.addCallback(routes.allRoute, this);
    }

    protected build() {
        Router.callCallback(routes.allRoute, this);
    }

    protected render(state: State<any>, prev: any, cur: any): void {
        switch (state) {
            case this.child:
                prev && prev.destroy();
                cur && this.element.appendChild(cur.element);
                cur?.element.classList.add('page')
                break;
        }
    }

    destroy() {
        super.destroy();

        Router.removeCallback(routes.allRoute, this)
    }

    onRoute({ route, params }: CallbackData) {
        console.error(params)
        switch (route) {
            case routes.allRoute:
                switch (params[1]) {
                    case 'history':
                        this.child.setState(new DisplayAllHistory());
                        break;
                    case 'recommendations':
                        this.child.setState(new DisplayAllRecommendations());
                        break;
                    case 'loved':
                        this.child.setState(new DisplayAllRecommendations());
                        break;
                    case 'loved-albums':
                        this.child.setState(new DisplayAllAlbums())
                        break;
                    case 'recommendations-albums':
                        this.child.setState(new DisplayAllAlbums())
                        break;
                    case 'loved-artists':
                        this.child.setState(new DisplayAllArtists())
                        break;
                    case 'recommendation-artists':
                        this.child.setState(new DisplayAllArtists())
                        break;
                    default:
                        this.child.setState(new NotFound());
                }
                this.child.getState().element.style.width = '100%';
                this.child.getState().element.style.height = '100%';
                break;
        }
    }
}
