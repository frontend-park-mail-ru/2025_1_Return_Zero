import { Component } from "../rzf/Component.js";

import { userState } from "./UserState.js";

export class Home extends Component {
    static BASE_ELEMENT = "section"

    init() {
        this.createCallback(userState, () => this.someFunction());
    }

    someFunction() {
        console.log(`Example of this callback is not called because 
            when you login active tab is login 
            and home callbacks are removed from userState
            when you switch to login page`);
    }

    build() {
        this.element.insertAdjacentHTML("beforeend", `
            ${userState.getState() ? `<h4>Hi, ${userState.getState().login}!</h4>` : ``}
            <h1>Lent</h1>
            <img src="https://avatars.mds.yandex.net/i?id=64df087d69973d72cdc87000a26b79f4_l-5278228-images-thumbs&n=13">
            <img src="https://s1.1zoom.ru/big3/524/Seasons_Winter_Sunrises_467289.jpg">
        `)
    }
}

export class Login extends Component {
    static BASE_ELEMENT = "section"

    build() {
        this.element.insertAdjacentHTML("beforeend", `
            <h1>Login</h1>
            <form>
                <input type="text" placeholder="Email">
                <input type="password" placeholder="Password">
                <button type="submit">Login</button>
            </form>
        `)
        this.element.querySelector("form").addEventListener("submit", e => {
            e.preventDefault();
            userState.setState({
                login: "John Doe"
            });
        })
    }
}

export class Logout extends Component {
    static BASE_ELEMENT = "section"

    build() {
        this.element.insertAdjacentHTML("beforeend", `
            <button>Logout</button>
        `)
        this.element.querySelector("button").addEventListener("click", () => {
            userState.setState(undefined);
        })
    }
}