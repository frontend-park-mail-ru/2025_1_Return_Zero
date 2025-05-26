import { Component } from "libs/rzf/Component";

import { TrackCard, TrackLine } from "components/track/Track";
import { Special } from "components/special/Special";
import { Section } from "components/elements/Section";

import { USER_STORAGE, JAM_STORAGE, PLAYER_STORAGE } from "utils/flux/storages";


import { ACTIONS } from "utils/flux/actions";
import { API } from "utils/api";

import { Leader, Listener } from "utils/flux/JamStorage";

import './pages.scss';
import Dispatcher from "libs/flux/Dispatcher";
import { Preloader } from "components/preloader/Preloader";

import playerStorage from "utils/flux/PlayerStorage";

export class JamPage extends Component {
    state = {
        leader: JAM_STORAGE.leader as Leader | null,
        listeners: JAM_STORAGE.listeners as Listener[] | null,
        now_playing: JAM_STORAGE.now_playing as AppTypes.Track | null,
    }

    componentDidMount() {
        USER_STORAGE.subscribe(this.onAction);
        JAM_STORAGE.subscribe(this.onAction);
        PLAYER_STORAGE.subscribe(this.onAction);
        this.fetchData();
    }

    componentWillUnmount(): void {
        USER_STORAGE.unsubscribe(this.onAction);
        JAM_STORAGE.unsubscribe(this.onAction);
        PLAYER_STORAGE.unsubscribe(this.onAction);
    }

    fetchData() {
        if (USER_STORAGE.getUser()) {
            API.getFavoriteTracks(USER_STORAGE.getUser().username).then(res => {
                this.setState({ });
            }).catch(() => this.setState({}))
        }

        Dispatcher.dispatch(new ACTIONS.JAM_OPEN(this.props.room_id));
    }

    onAction = (action: any) => {
        switch (true) {
            case action instanceof ACTIONS.USER_LOGIN:
            case action instanceof ACTIONS.USER_CHANGE:
            case action instanceof ACTIONS.USER_LOGOUT:
                this.fetchData();
                break;
            case action instanceof ACTIONS.JAM_UPDATE:
                this.setState({ 
                    leader: JAM_STORAGE.leader,
                    listeners: JAM_STORAGE.listeners,
                    now_playing: JAM_STORAGE.now_playing,
                });

                break;
            case action instanceof ACTIONS.JAM_OPEN:
                break;
            case action instanceof ACTIONS.AUDIO_RETURN_METADATA:
                Dispatcher.dispatch(new ACTIONS.JAM_HOST_LOAD(PLAYER_STORAGE.currentTrack?.id.toString() || ''));
                Dispatcher.dispatch(new ACTIONS.JAM_READY(null));
                break;
        }
    }

    render() {
        return [
            <div className="page page--jam">
                <Section title="Совместное прослушивание" horizontal>
                    <div className="page__info">
                        <img className="page__info__img" src={this.state.leader?.img_url} alt={this.state.leader?.name} />
                        <div className="page__info__leader">
                            <span className="page__info__main">Лидер комнаты:</span>
                            <span className="page__info__leader_name">{this.state.leader?.name}</span>

                            <div className="page__info__link_container">
                                <img src="/static/img/copy.svg" alt="copy" />
                                <span className="page__info__link">Скопировать ссылку на комнату</span>
                            </div>
                        </div>
                    </div>
                </Section>

                <Section title="Сейчас играет:" horizontal>
                    {this.state.now_playing && <TrackLine track={this.state.now_playing} />}
                </Section>

                <Section title="Слушатели:" horizontal>
                    <div className="page__listeners">
                        {this.state.listeners?.map(listener => (
                            <div className="page__listener" key={listener.id}>
                                <img className="page__listener__img" src={listener.img_url} alt={listener.name} />
                                <span className="page__listener__name">{listener.name}</span>
                                {
                                    listener.ready ?
                                        <img className="page__listeners__status" src="/static/img/ready.svg" /> 
                                        : <Preloader width={1.5} height={1.5} />
                                }
                            </div>
                        ))}
                    </div>
                </Section>
            </div>
        ]
    }
}
