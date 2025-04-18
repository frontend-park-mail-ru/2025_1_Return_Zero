import { DisplayAll } from "./DisplayAll";
import { API } from "utils/api";
import { DataTypes } from "utils/api_types";

export class DisplayAllArtists extends DisplayAll {
    protected static BASE_ELEMENT = 'section';
    // @ts-ignore
    protected static template = Handlebars.templates['artist-card.hbs'];

    protected init() {
        super.init();
        this.element.style.gap = '1.25rem';
        this.element.style.flexDirection = 'row';
        this.retrieveFunction.setState(DisplayAllArtists.retrieve);
    }

    protected static async retrieve(limit: number, offset: number): Promise<DataTypes.Artist[]> {
        try {
            return (await API.getArtists(limit, offset)).body
        } catch (e) {
            console.error(e.message)
            return []
        }
    }
}
