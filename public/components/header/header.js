import './header.precompiled.js'
import { config } from '../../config.js';

export function renderHeader() {
    const template = Handlebars.templates['header.hbs'];
    const content = {
        navItems: config.nav,
    };

    return template(content, content);
}