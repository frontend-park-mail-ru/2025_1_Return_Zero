import Router from 'libs/Router';

import { RootComponent } from './libs/Component.ts';
import { MainLayout } from './layouts/MainLayout.ts';


export default class App extends RootComponent {
    protected init() {
        console.log('App init');

        this.element.addEventListener('click', (e) => {
            if (e.target instanceof HTMLAnchorElement) {
                e.preventDefault();
                if (e.target.style.cursor == 'not-allowed') {  // just for now
                    return;
                }
                console.error(`[App] Navigating to ${e.target.href}`);
                Router.pushUrl((e.target as HTMLAnchorElement).href, {});
            }
        })
    }

    protected build() {
        this.element.appendChild(new MainLayout().element);
    }
}
