import './tracks.precompiled.js';

import '../../components/musics';
import '../../components/tracks';

import '../pages.scss';

import { Component } from '../../libs/Component.ts';
import { API } from 'utils/api';
import { userState } from '../../utils/states';

export class TracksPage extends Component {
    // @ts-ignore
    static template = Handlebars.templates['tracks.hbs'];

    constructor() {
        super();
    }

    protected init() {
        this.element.classList.add('page');
    }

    protected build() {
        this.element.innerHTML = '';

        (async () => {
            try {
                const tracks = (await API.getTracks()).body;

                const loved = tracks;
                let recent;
                try {
                    recent = userState.getState()?.username && (await API.getHistoryTracks(userState.getState().username)).body;
                } catch (e) {
                    console.log(e.message);
                }
                const recommendations = tracks;

                this.element.insertAdjacentHTML(
                    'beforeend',
                    TracksPage.template({
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
