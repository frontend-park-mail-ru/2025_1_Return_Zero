import { Component } from '../libs/Component.ts';
import { State } from '../libs/State.ts';
import Router, { Routable, CallbackData } from '../libs/Router.ts';
import { userState } from '../states';
import { routes } from '../routes';

import { Header } from '../components/header/header.ts';
import { Playlists } from '../components/playlists/playlists.ts';
import { BottomPlayer } from '../components/bottomPlayer/bottomPlayer.ts';

import { MainPage } from '../pages/main/main.ts';
import { TracksPage } from '../pages/tracks/tracks.ts';
import { AlbumsPage } from '../pages/albums/albums.ts';
import { ProfilePage } from '../pages/profile/profile.ts';

import { AuthForm } from 'components/auth/auth.ts';

import { ArtistsLayout } from './ArtistsLayout';

import './MainLayout.scss';

export class MainLayout extends Component implements Routable {
    protected static path = routes.pageRoute;
    protected static authPath = routes.authRoute;
    protected static logoutPath = routes.logoutRoute;

    header: Header;
    playlists: Playlists;
    bottomPlayer: BottomPlayer;
    child: State<Component>;
    popup: State<Component>;

    protected init() {
        this.element.classList.add('main-layout');

        this.child = this.createState(null);
        this.popup = this.createState(null);
        Router.addCallback(MainLayout.path, this);
        Router.addCallback(MainLayout.authPath, this);
        Router.addCallback(MainLayout.logoutPath, this);
    }

    protected build() {
        this.header = new Header();
        this.playlists = new Playlists();
        this.bottomPlayer = new BottomPlayer();

        this.element.appendChild(this.header.element);
        this.element.appendChild(this.playlists.element);
        this.element.appendChild(this.bottomPlayer.element);

        Router.callCallback(MainLayout.path, this);
        Router.callCallback(MainLayout.authPath, this);
        Router.callCallback(MainLayout.logoutPath, this);
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

        Router.removeCallback(MainLayout.path, this);
        Router.removeCallback(MainLayout.authPath, this);
        Router.removeCallback(MainLayout.logoutPath, this);
    }

    onRoute({
        path,
        params,
    }: CallbackData) {
        switch (path) {
            case MainLayout.authPath:
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
            case MainLayout.path:
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
                        this.child.setState(new ProfilePage());
                        break;
                }
                break;
            case MainLayout.logoutPath:
                if (params[0] !== MainLayout.logoutPath) 
                    break;
                userState.setState(null);
                Router.pushUrl('/', {});
                break;
        }
    }
}
