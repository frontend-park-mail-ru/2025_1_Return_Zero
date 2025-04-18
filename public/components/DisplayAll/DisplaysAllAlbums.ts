import { DisplayAll } from "./DisplayAll";
import { API } from "utils/api";
import { DataTypes } from "utils/api_types";

export class DisplayAllAlbums extends DisplayAll {
    protected static BASE_ELEMENT = 'section';
    // @ts-ignore
    protected static template = Handlebars.templates['album.hbs'];

    protected init(...args: any[]) {
        super.init();
        this.element.style.gap = '1.25rem';
        this.retrieveFunction.setState(DisplayAllAlbums.retrieve);
    }

    protected static async retrieve(limit: number, offset: number): Promise<DataTypes.Album[]> {
        try {
            return (await API.getAlbums(limit, offset)).body
        } catch (e) {
            console.error(e.message)
            return []
        }
    }
}

export class DisplayAllArtistAlbums extends DisplayAllAlbums {
    artist_id: number;

    protected init(artist_id: number) {
        this.artist_id = artist_id;

        super.init();
        this.retrieveFunction.setState(this.retrieve.bind(this));
    }

    protected async retrieve(limit: number, offset: number): Promise<DataTypes.Album[]> {
        try {
            return (await API.getArtistAlbums(this.artist_id, limit, offset)).body
        } catch (e) {
            console.error(e.message)
            return []
        }
    }
}