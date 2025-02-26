import { createMenu } from './renders.js';
import { renderPage } from './renders.js';

const appState = {
    activePageLink: null,
    menuElements: {},
};

renderPage(appState);
