import './playlists.scss';
import './playlists.precompiled.js';

import { Component } from '../../libs/Component.ts';

export class Playlists extends Component {
    protected static BASE_ELEMENT = 'section';
    // @ts-ignore
    static template = Handlebars.templates['playlists.hbs'];

    constructor() {
        super();
    }

    protected init() {
        this.element.id = 'playlists-panel';
    }

    protected build() {
        // @ts-ignore
        this.element.innerHTML = Playlists.template({ playlists: [] });
    }
}
