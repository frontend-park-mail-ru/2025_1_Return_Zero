import './main.precompiled.js';

import '../../components/musics';
import '../../components/tracks';

import '../pages.scss';

import { Component } from '../../libs/Component.ts';
import { API } from 'utils/api';
import { userState } from '../../utils/states';

export class MainPage extends Component {
    // @ts-ignore
    static template = Handlebars.templates['main.hbs'];

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

                const content = {
                    loved: tracks,
                    recent: tracks,
                    recommendations: tracks,
                };

                this.element.insertAdjacentHTML(
                    'beforeend',
                    MainPage.template(content)
                );
            } catch (e) {
                console.log(e);
            }
        })();
    }
}
