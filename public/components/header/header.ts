import './header.precompiled.js';
import './header.scss';

import { Component } from '../../libs/Component.ts';
import { State } from '../../libs/State.ts';
import Router, { Routable, CallbackData } from '../../libs/Router.ts';
import { routes } from '../../utils/routes';

import { userState } from '../../utils/states';

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
    // @ts-ignore
    static template = Handlebars.templates['header.hbs'];

    active: State<HTMLElement>;

    protected init() {
        this.element.classList.add('header');

        this.active = this.createState(null);
        this.createCallback(userState, () => this.build());

        Router.addCallback(routes.pageRoute, this);
        Router.addCallback(routes.authRoute, this);
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

        const logo = this.element.querySelector('#logo');
        logo.addEventListener('click', () => {
            Router.pushUrl('/', {});
        });

        Router.callCallback(routes.pageRoute, this);
        Router.callCallback(routes.authRoute, this);
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
        Router.removeCallback(routes.pageRoute, this);
    }

    onRoute({ route, params }: CallbackData) {
        switch (route) {
            case routes.pageRoute:
                this.active.setState(
                    this.element.querySelector?.(
                        `.header__nav li>a[href="${params[0]}"]`
                    )?.parentElement
                );
                break;
            case routes.authRoute:
                this.element
                    .querySelectorAll('.header__auth>a')
                    .forEach((a) => {
                        a.classList.remove('active');
                    });
                this.element
                    .querySelector(`.header__auth>a[href="#${params[1]}"]`)
                    ?.classList.add('active');
                break;
        }
    }
}
