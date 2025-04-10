import './header.precompiled.js';
import './header.scss';

import { Component } from '../../libs/Component.ts';
import { State } from '../../libs/State.ts';
import Router, { Routable, CallbackData } from '../../libs/Router.ts';
import { routes } from '../../routes';

import { userState } from '../../states.ts';

const navItems = {
    '/': {
        text: 'Главная',
        href: '/',
        icon: '/static/img/icon-home.svg',
    },
    '/tracks': {
        text: 'Треки',
        href: '/tracks',
        icon: '/static/img/icon-tracks.svg',
    },
    '/albums': {
        text: 'Альбомы',
        href: '/albums',
        icon: '/static/img/icon-albums.svg',
    },
    '/artists': {
        text: 'Артисты',
        href: '/artists',
        icon: '/static/img/icon-artists.svg',
    },
};

export class Header extends Component implements Routable {
    protected static BASE_ELEMENT = 'header';
    protected static path = routes.pageRoute;
    protected static authPath = routes.authRoute;
    // @ts-ignore
    static template = Handlebars.templates['header.hbs'];

    active: State<HTMLElement>;


    protected init() {
        this.element.classList.add('header');

        this.active = this.createState(null);
        this.createCallback(userState, () => this.build());

        Router.addCallback(Header.path, this);
        Router.addCallback(Header.authPath, this);
    }

    protected build() {
        this.element.innerHTML = '';
        // @ts-ignore
        this.element.insertAdjacentHTML(
            'beforeend',
            Header.template({
                navItems,
                user: userState.getState(),
            })
        );

        Router.callCallback(Header.path, this);
        Router.callCallback(Header.authPath, this);
    }

    protected render(state: State<any>, prev: any, cur: any) {
        switch (state) {
            case this.active:
                prev && prev.classList.remove('active');
                cur && cur.classList.add('active');
                break;
        }
    }

    destroy() {
        Router.removeCallback(Header.path, this);
    }

    onRoute({
        path,
        params,
    }: CallbackData) {
        switch (path) {
            case Header.path:
                this.active.setState(
                    this.element.querySelector?.(`.header__nav li>a[href="${params[0]}"]`)
                        ?.parentElement
                );
                break;
            case Header.authPath:
                this.element.querySelectorAll('.header__auth>a').forEach((a) => {
                    a.classList.remove('active');
                });
                this.element
                    .querySelector(`.header__auth>a[href="#${params[1]}"]`)
                    ?.classList.add('active');
                break;
        }
    }
}
