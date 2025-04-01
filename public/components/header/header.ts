import './header.precompiled.js';
import './header.css';

import { Component } from '../../libs/Component.ts';
import { State } from '../../libs/State.ts';
import Router, { Routable, CallbackData } from '../../libs/Router.ts';
import { userState } from '../../states.ts';

const navItems = {
    '/': {
        text: 'Home',
        href: '/',
        icon: '/static/img/icon-home.svg',
    },
    '/tracks': {
        text: 'Tracks',
        href: '/tracks',
        icon: '/static/img/icon-tracks.svg',
    },
    '/albums': {
        text: 'Albums',
        href: '/albums',
        icon: '/static/img/icon-albums.svg',
    },
    '/artists': {
        text: 'Artists',
        href: '/artists',
        icon: '/static/img/icon-artists.svg',
    },
};

export class Header extends Component implements Routable {
    protected static BASE_ELEMENT = 'header';
    protected static path = '^/(tracks|albums|artists|)';
    // @ts-ignore
    static template = Handlebars.templates['header.hbs'];

    active: State<HTMLElement>;

    protected init() {
        this.element.id = 'header';

        this.active = this.createState(null);
        this.createCallback(userState, () => this.build());

        Router.addCallback(Header.path, this);
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
        this.element
            .querySelector('.header__nav')
            .addEventListener('click', (e) => {
                e.preventDefault();

                if (e.target instanceof HTMLAnchorElement) {
                    Router.pushUrl((e.target as HTMLAnchorElement).href, {});
                }
            });

        Router.callCallback(Header.path, this);
    }

    protected render(state: State<any>, prev: any, cur: any) {
        switch (state) {
            case this.active:
                prev && prev.classList.remove('active');
                cur.classList.add('active');
                break;
        }
    }

    destroy() {
        Router.removeCallback(Header.path, this);
    }

    onRoute({
        newUrl
    }: CallbackData) {
        this.active.setState(
            this.element.querySelector(`.header__nav li>a[href="${newUrl}"]`)
                .parentElement
        );
    }
}
