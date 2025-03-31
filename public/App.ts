import { RootComponent } from './libs/Component.ts';
import { MainLayout } from './layouts/MainLayout.ts';

export default class App extends RootComponent {
    protected init() {
        console.log('App init');
    }

    protected build() {
        this.element.appendChild(new MainLayout().element);
    }
}
