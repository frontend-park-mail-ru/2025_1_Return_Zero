import Dispatcher from "libs/flux/Dispatcher";
import { ACTIONS } from "utils/flux/actions";

class Broadcast {
    channel: BroadcastChannel;

    constructor() {
        this.channel = new BroadcastChannel('sync');
        this.channel.addEventListener('message', this.receive.bind(this));
    }

    send(action: string, payload: any) {
        this.channel.postMessage({action, payload});
    }

    receive(event: MessageEvent) {
        const { action, payload } = event.data;
        
        console.log(action, payload);

        switch (action) {
            case 'trackLike':
                Dispatcher.dispatch(new ACTIONS.TRACK_LIKE_STATE(payload));
                break;
        }
    }
}

export default new Broadcast();

