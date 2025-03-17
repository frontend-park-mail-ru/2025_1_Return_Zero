import { RootComponent } from "../rzf/Component.js";

import { Nav } from "./Nav.js";
import { Home, Login, Logout } from "./Pages.js";

import { userState } from "./UserState.js";

export class App extends RootComponent {
    init() {
        this.pageState = this.createState("home");
        this.createCallback(userState, () => this.pageState.setState("home"));
    }

    build() {
        this.element.appendChild(new Nav(this.pageState).element);
        this.element.appendChild(new Home(this.pageState).element);
    }

    render(prev, cur) {
        const prev_page = this.element.querySelector(`.${prev}`);
        prev_page && prev_page.remove();

        switch (cur) {
            case "home":
                this.element.appendChild(new Home(this.pageState).element);
                break;
            case "login":
                this.element.appendChild(new Login(this.pageState).element);
                break;
            case "logout":
                this.element.appendChild(new Logout(this.pageState).element);
                break;
        }
    }
}
