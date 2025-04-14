import './main.precompiled.js';

import '../../components/musics';
import '../../components/tracks';

import '../pages.scss';

import { Component } from '../../libs/Component.ts';
import { API } from 'utils/api';
import { userState } from 'utils/states';

export class MainPage extends Component {
    // @ts-ignore
    static template = Handlebars.templates['main.hbs'];

    protected init() {
        this.element.classList.add('page');

        this.createCallback(userState, () => this.build());
    }

    protected build() {
        this.element.innerHTML = '';

        (async () => {
            try {
                const tracks = (await API.getTracks()).body;

                const loved = tracks;
                const recent = userState.getState()?.username && (await API.getHistoryTracks(userState.getState().username)).body;
                const recommendations = tracks;

                this.element.insertAdjacentHTML(
                    'beforeend',
                    MainPage.template({
                        loved,
                        recent,
                        recommendations
                    })
                );
            } catch (e) {
                console.log(e);
            }
        })();
    }
}
