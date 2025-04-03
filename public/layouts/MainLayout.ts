import { Component } from '../libs/Component.ts';
import Router, { Routable, CallbackData } from '../libs/Router.ts';
import { State } from '../libs/State.ts';

import { Header } from '../components/header/header.ts';
import { Playlists } from '../components/playlists/playlists.ts';

import { MainPage } from '../pages/main/main.ts';
import { TracksPage } from '../pages/tracks/tracks.ts';
import { AlbumsPage } from '../pages/albums/albums.ts';
import { ArtistsPage } from '../pages/artists/artists.ts';

import { LoginForm, SignupForm } from 'components/auth/auth.ts';

import './MainLayout.css';

export class MainLayout extends Component implements Routable {
    protected static path = '^/(tracks|albums|artists|)';
    protected static authPath = '#(login|register)$';

    header: Header;
    playlists: Playlists;
    child: State<Component>;
    popup: State<Component>;

    protected init() {
        this.element.classList.add('main-layout');

        this.child = this.createState(null);
        this.popup = this.createState(null);
        Router.addCallback(MainLayout.path, this);
    }

    protected build() {
        this.header = new Header();
        this.playlists = new Playlists();

        this.element.appendChild(this.header.element);
        this.element.appendChild(this.playlists.element);

        Router.callCallback(MainLayout.path, this);
    }

    protected render(state: State<any>, prev: any, cur: any): void {
        switch (state) {
            case this.child:
                prev && prev.destroy();
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
    }

    onRoute({
        path,
        pathParams,
    }: CallbackData) {
        switch (path) {
            case MainLayout.authPath:
                console.error('Sosiska!');
                switch (pathParams[1]) {
                    case 'login':
                        this.popup.setState(new LoginForm());
                        break;
                    case 'register':
                        this.popup.setState(new SignupForm());
                        break;
                }
                break;
            case MainLayout.path:
                console.error('Sosulka!');
                switch (pathParams[1]) {
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
                        this.child.setState(new ArtistsPage());
                        break;
                }
                break;
        }
    }
}
