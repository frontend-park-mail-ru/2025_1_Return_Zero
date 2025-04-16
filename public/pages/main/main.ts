import './main.precompiled.js';

import '../../components/musics';
import '../../components/tracks';

import '../pages.scss';

import { Component } from '../../libs/Component.ts';

import { Form } from 'libs/rzv/form';
import { describers } from 'utils/validation';

import { API } from 'utils/api';
import { userState } from 'utils/states';

export class MainPage extends Component {
    // @ts-ignore
    static template = Handlebars.templates['main.hbs'];

    form: Form;

    protected init() {
        this.element.classList.add('page');

        this.createCallback(userState, () => this.build());
    }

    protected build() {
        (async () => {
            let tracks;
            try {
                tracks = (await API.getTracks()).body;
            } catch (e) {
                console.error(e.message);
            }
            const loved = tracks;
            const recommendations = tracks;

            let recent;
            try {
                recent =
                    userState.getState()?.username &&
                    (await API.getHistoryTracks(userState.getState().username))
                        .body;
            } catch (e) {
                console.error(e.message);
            }

            this.element.innerHTML = '';
            this.element.insertAdjacentHTML(
                'beforeend',
                MainPage.template({
                    recent,
                    loved,
                    recommendations,
                })
            );

            this.form = new Form({
                username: describers.username,
                password: describers.password,
            })
            this.form.bind(this.element.querySelector('form'));
            this.element.querySelector('form').addEventListener('submit', (e) => {
                e.preventDefault();
                this.form.validate(this.form.values)
                if (this.form.okay())
                    console.log(this.form)
                else
                    console.error(this.form)
            })
        })();
    }
}
