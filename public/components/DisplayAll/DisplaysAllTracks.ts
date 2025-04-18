import { DisplayAll } from "./DisplayAll";
import { API } from "utils/api";
import { DataTypes } from "utils/api_types";
import { userState } from "utils/states";

export class DisplayAllTracks extends DisplayAll {
    protected static BASE_ELEMENT = 'section';
    // @ts-ignore
    protected static template = Handlebars.templates['track.hbs'];

    protected init(...args: any[]) {
        super.init();
        this.element.style.gap = '1.25rem';
    }
}

export class DisplayAllRecommendations extends DisplayAllTracks {
    protected init() {
        super.init();
        this.retrieveFunction.setState(DisplayAllRecommendations.retrieve);
    }

    protected static async retrieve(limit: number, offset: number): Promise<DataTypes.Track[]> {
        try {
            return (await API.getTracks(limit, offset)).body
        } catch (e) {
            console.error(e.message)
            return []
        }
    }
}

export class DisplayAllHistory extends DisplayAllTracks {
    protected init() {
        super.init();

        this.createCallback(userState, () => this.retrieveFunction.setState(
            userState.getState() ? DisplayAllHistory.retrieve : () => Promise.resolve([])
        ))
        this.retrieveFunction.setState(
            userState.getState() ? DisplayAllHistory.retrieve : () => Promise.resolve([])
        )
    }

    protected static async retrieve(limit: number, offset: number): Promise<DataTypes.Track[]> {
        try {
            return (await API.getHistoryTracks(userState.getState().username, limit, offset)).body
        } catch (e) {
            console.error(e.message)
            return []
        }
    }
}

export class DisplayAllArtistTracks extends DisplayAllTracks {
    artist_id: number;

    protected init(artist_id: number) {
        this.artist_id = artist_id;

        super.init();
        this.retrieveFunction.setState(this.retrieve.bind(this));
    }

    protected async retrieve(limit: number, offset: number): Promise<DataTypes.Track[]> {
        try {
            return (await API.getArtistTracks(this.artist_id, limit, offset)).body
        } catch (e) {
            console.error(e.message)
            return []
        }
    }
}