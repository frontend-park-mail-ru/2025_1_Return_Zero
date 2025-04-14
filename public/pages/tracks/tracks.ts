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
                TracksPage.template({
                    recent,
                    loved,
                    recommendations,
                })
            );
        })();
    }
}
