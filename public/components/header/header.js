import './header.precompiled.js';

export function renderHeader(navItems) {
    const template = Handlebars.templates['header.hbs'];

    const content = {
        navItems,
    };

    return template(content, content);
}
