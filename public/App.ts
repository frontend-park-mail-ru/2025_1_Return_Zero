import Router from 'libs/Router';

import { RootComponent } from './libs/Component.ts';
import { MainLayout } from './layouts/MainLayout.ts';

import { addToQueueListener } from 'components/player/queueExportFunctions';

export default class App extends RootComponent {
    protected init() {
        console.log('App init');

        this.initEventListeners();
    }

    protected build() {
        this.element.appendChild(new MainLayout().element);
    }

    private initEventListeners() {
        this.element.addEventListener('click', (e) => {
            const target = e.target;

            if (target instanceof HTMLAnchorElement) {
                e.preventDefault();
                if (target.style.cursor == 'not-allowed') {  // just for now
                    return;
                }
                console.error(`[App] Navigating to ${target.href}`);
                Router.pushUrl((target as HTMLAnchorElement).href, {});
            }
            if (target instanceof HTMLImageElement && target.id === 'track') {
                addToQueueListener(target);
            }
        })

        this.element.addEventListener('mouseover', (e: MouseEvent) => {
            const target = e.target;

            if (target instanceof HTMLImageElement && target.id === 'track') {
                target.style.filter = 'brightness(0.5)';
                target.style.transition = 'filter 0.3s ease';
            }
        });
        
        this.element.addEventListener('mouseout', (e: MouseEvent) => {
            const target = e.target;

            if (target instanceof HTMLImageElement && target.id === 'track') {
                target.style.filter = 'brightness(1)';
            }
        });
    }
}
