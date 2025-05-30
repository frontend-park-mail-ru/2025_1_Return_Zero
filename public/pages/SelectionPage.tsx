import { Section } from "components/elements/Section";
import { TrackLine } from "components/track/Track";
import { Component } from "libs/rzf/Component";
import { API, SELECTION_VARIANTS } from "utils/api";


export class SelectionPage extends Component {
    state = {
        tracks: [] as AppTypes.Track[],
        tracks_loading: true
    }

    props: {
        selection: string
    }

    componentDidMount(): void {
        this.setState({tracks_loading: true})
        API.getSelectionTracks(this.props.selection as SELECTION_VARIANTS)
            .then(tracks => this.setState({tracks: tracks.body}))
            .catch(console.error)
            .finally(() => this.setState({tracks_loading: false}))
    }

    render() {
        let title = "";
        switch (this.props.selection) {
            case "most-recent":
                title = "Новинки";
                break;
            case "most-liked":
                title = "Самое любимое";
                break;
            case "most-liked-last-week":
                title = "Открытия недели";
                break;
            case "most-listened-last-month":
                title = "Популярное";
                break;
            case "top-chart":
                title = "Топ чарт";
                break;
            default:
                return [
                    <div className="page page--404 page__empty">
                        <img src="/static/img/icon-tracks.svg" alt="" />
                        <h1>Подборка не найдена</h1>
                    </div>
                ]
        }
        return [
            <div className="page page--selection">
                <Section title={title} is_loading={this.state.tracks_loading}>
                    {this.state.tracks.map((track, i) => {
                        return <TrackLine key={track.id} track={track} ind={i} />
                    })}
                </Section>
            </div>
        ]
    }
}