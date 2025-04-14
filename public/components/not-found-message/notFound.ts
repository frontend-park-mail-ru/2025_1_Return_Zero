import './notFound.scss';
import './notFound.precompiled.js';

import { Component } from 'libs/Component.ts';

export class NotFound extends Component {
    protected static BASE_ELEMENT = 'div';
    // @ts-ignore
    static template = Handlebars.templates['notFound.hbs'];

    protected init() {
        this.element.id = 'not-found';
        this.element.classList.add('not-found');
    }

    protected build() {
        this.element.innerHTML = '';

        this.element.insertAdjacentHTML(
            'beforeend',
            NotFound.template({}),
        );
    }
}
