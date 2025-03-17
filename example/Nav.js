import { Component } from "../rzf/Component.js";

import { userState } from "./UserState.js";

export class Nav extends Component {
    static BASE_ELEMENT = "nav"
    init(pageState) {
        this.createCallback(userState, (prev, cur) => this.build(prev, cur));

        this.pageState = pageState;
        this.createCallback(this.pageState, (prev, cur) => this.build(prev, cur));

        this.element.addEventListener("click", e => {
            if (e.target.dataset.page) {
                e.preventDefault();
                this.pageState.setState(e.target.dataset.page);
            }
        })
    }

    build() {
        this.element.innerHTML = "";

        const items = userState.getState() ? {
            "home": {
                text: "Home",
                href: "/",
            },
            "logout": {
                text: "Logout",
                href: "/logout",
            },
            "profile": {
                text: userState.getState().login,
                href: "",
            }
        } : {
            "home": {
                text: "Home",
                href: "/",
            },
            "login": {
                text: "Login",
                href: "/login",
            }
        };

        for (let [key, item] of Object.entries(items)) {
            const a = document.createElement("a");
            a.href = item.href;
            a.textContent = item.text;
            a.dataset.page = key;
            this.pageState.getState() === key && a.classList.add("active");

            this.element.appendChild(a);
        }
    }

    render = function (prev, cur) {
        const prev_link = this.element.querySelector(`a[data-page="${prev}"]`)
        const cur_link = this.element.querySelector(`a[data-page="${cur}"]`)

        prev_link && prev_link.classList.remove("active");
        cur_link && cur_link.classList.add("active");
    }
}
