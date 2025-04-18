import { Component } from '../libs/Component.ts';
import { State } from '../libs/State.ts';
import Router, { Routable, CallbackData } from '../libs/Router.ts';

import { API } from '../utils/api';
import { userState } from '../utils/states';
import { routes } from '../utils/routes';

import { Header } from '../components/header/header.ts';
import { Playlists } from '../components/playlists/playlists.ts';
import bottomPlayer, {
    BottomPlayer,
} from '../components/bottomPlayer/bottomPlayer.ts';

import { MainPage } from '../pages/main/main.ts';
import { TracksPage } from '../pages/tracks/tracks.ts';
import { AlbumsPage } from '../pages/albums/albums.ts';

import { AuthForm } from 'components/auth/auth.ts';

import { ArtistsLayout } from './ArtistsLayout';
import { ProfileLayout } from './ProfileLayout';
import { DisplayAllLayout } from './DisplayAllLayout';

import './MainLayout.scss';

export class MainLayout extends Component implements Routable {
    header: Header;
    playlists: Playlists;
    bottomPlayer: BottomPlayer;
    child: State<Component>;
    popup: State<Component>;

    protected init() {
        this.element.classList.add('main-layout');

        this.child = this.createState(null);
        this.popup = this.createState(null);
        Router.addCallback(routes.pageRoute, this);
        Router.addCallback(routes.authRoute, this);
        Router.addCallback(routes.logoutRoute, this);
    }

    protected build() {
        this.header = new Header();
        this.playlists = new Playlists();
        this.bottomPlayer = bottomPlayer;

        this.element.appendChild(this.header.element);
        this.element.appendChild(this.playlists.element);
        this.element.appendChild(this.bottomPlayer.element);

        Router.callCallback(routes.pageRoute, this);
        Router.callCallback(routes.authRoute, this);
        Router.callCallback(routes.logoutRoute, this);
    }

    protected render(state: State<any>, prev: any, cur: any): void {
        switch (state) {
            case this.child:
                prev && prev.element.remove();
                this.element.appendChild(cur.element);
                break;
            case this.popup:
                prev && prev.destroy();
                cur && this.element.appendChild(cur.element);
                break;
        }
    }

    destroy() {
        super.destroy();

        Router.removeCallback(routes.pageRoute, this);
        Router.removeCallback(routes.authRoute, this);
        Router.removeCallback(routes.logoutRoute, this);
    }

    onRoute({ route, params }: CallbackData) {
        switch (route) {
            case routes.authRoute:
                switch (params[1]) {
                    case 'login':
                        this.popup.setState(new AuthForm('login'));
                        break;
                    case 'register':
                        this.popup.setState(new AuthForm('register'));
                        break;
                    default:
                        this.popup.setState(null);
                }
                break;
            case routes.pageRoute:
                switch (params[1]) {
                    case '':
                        this.child.setState(new MainPage());
                        break;
                    case 'tracks':
                        this.child.setState(new TracksPage());
                        break;
                    case 'albums':
                        this.child.setState(new AlbumsPage());
                        break;
                    case 'artists':
                        this.child.setState(new ArtistsLayout());
                        break;
                    case 'profile':
                        this.child.setState(new ProfileLayout());
                        break;
                    case 'all':
                        this.child.setState(new DisplayAllLayout());
                        break;
                }
                break;
            case routes.logoutRoute:
                if (params[0] === '') break;
                (async () => {
                    try {
                        await API.postLogout();
                        userState.setState(null);
                        Router.pushUrl('/', {});
                    } catch (e) {
                        console.error(e);
                    }
                })();
                break;
        }
    }
}
