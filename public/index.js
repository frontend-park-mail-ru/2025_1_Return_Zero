import { createMenu } from './renders.js';

const root = document.getElementById('root');
const menuContainer = document.createElement('menu');
const pageContainer = document.createElement('main');
root.appendChild(menuContainer);
root.appendChild(pageContainer);

const appState = {
    activePageLink: null,
    menuElements: {},
};

createMenu(menuContainer, pageContainer, appState);
