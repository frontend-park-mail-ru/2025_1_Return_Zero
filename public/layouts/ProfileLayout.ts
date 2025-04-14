import { Component } from '../libs/Component.ts';
import { State } from '../libs/State.ts';
import Router, { Routable, CallbackData } from '../libs/Router.ts';
import { routes } from '../utils/routes';

import { ProfilePage } from '../pages/profile/profile.ts';
import { SettingsPage } from '../pages/settings/settings.ts';

import './layout.scss';
import { API } from 'utils/api';
import { NotFound } from 'components/not-found-message/notFound';

export class ProfileLayout extends Component implements Routable {
    page: State<Component>;

    protected init() {
        this.element.classList.add('layout', 'layout--profile');

        this.page = this.createState(null);

        Router.addCallback(routes.profileRoute, this);
    }

    protected build() {
        Router.callCallback(routes.profileRoute, this);
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
        super.destroy();

        Router.removeCallback(routes.profileRoute, this);
    }

    onRoute({ route, params }: CallbackData) {
        switch (route) {
            case routes.profileRoute:
                (async () => {
                    if (!params[1] || params[1] == 'settings') return;

                    try {
                        (await API.getUser(params[1])).body;
                    } catch (error) {
                        const notFound = new NotFound();
                        this.element.innerHTML = '';
                        this.element.appendChild(notFound.element);
                        throw new Error('404 User not Found');
                    }
                })();

                switch (params[1]) {
                    case 'settings':
                        this.page.setState(new SettingsPage());
                        break;
                    default:
                        this.page.setState(new ProfilePage(params[1]));
                        break;
                }
                break;
        }
    }
}
