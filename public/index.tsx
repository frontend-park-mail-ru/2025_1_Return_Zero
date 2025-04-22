import h from "libs/rzf/jsx";
import App from "./App";
import vdom from "libs/rzf/VDom";

import "./index.scss";

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

vdom.bind(document.getElementById('root') as HTMLDivElement);
vdom.build(<App />)
