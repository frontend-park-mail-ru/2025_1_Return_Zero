import { initAt } from "libs/rzf/VDom";
import router from "libs/rzf/Router";

import App from "./App";

import Dispatcher from "libs/flux/Dispatcher";
import { ACTIONS } from "utils/flux/actions";
import { API } from "utils/api";

import "./index.scss";

// mocks
import 'utils/api_mocks';


async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register(
                '/sw.js',
                {
                    scope: '/',
                }
            );
            if (registration.installing) {
                console.log('Service worker installing');
            } else if (registration.waiting) {
                console.log('Service worker installed');
            } else if (registration.active) {
                console.log('Service worker active');
            }
        } catch (error) {
            console.error(`Registration failed with ${error}`);
        }
    }
}

registerServiceWorker();


initAt(<App />, document.getElementById('root')!);
router.callRoutes();

API.getCheck().then((user) => {
    Dispatcher.dispatch(new ACTIONS.USER_LOGIN(user.body));
})
