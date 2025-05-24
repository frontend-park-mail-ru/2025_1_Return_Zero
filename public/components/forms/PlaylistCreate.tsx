import { Component } from "libs/rzf/Component";
import { Button } from "../elements/Button";
import { Dialog } from "../elements/Dialog";

import { PLAYLIST_CREATE_VALIDATOR } from "utils/validators";

import Dispatcher from "libs/flux/Dispatcher";
import { ACTIONS } from "utils/flux/actions";
import { API } from "utils/api";

import { one_alive_async } from "utils/funcs";

import './PlaylistCreate.scss';
import './forms.scss'

export class PlaylistCreate extends Component {
    props: {
        onClose: () => void,
        onCreate: (playlist: AppTypes.Playlist) => void
    }
    state = {
        error: null as string | null
    }

    onSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        this._onSubmit();
    };

    _onSubmit = one_alive_async(async () => {
        if (!PLAYLIST_CREATE_VALIDATOR.validateAll()) {
            this.setState({
                error: 'Заполните все поля'
            })
            return;
        }

        try {
            const vr = PLAYLIST_CREATE_VALIDATOR.result
            const playlist = (await API.postPlaylist(
                vr.title.value,
                vr.thumbnail.value
            )).body;
            this.props.onCreate(playlist);
            Dispatcher.dispatch(new ACTIONS.CREATE_PLAYLIST(playlist));
            Dispatcher.dispatch(new ACTIONS.CREATE_NOTIFICATION({
                type: 'success',
                message: `Плейлист "${playlist.title}" успешно создан`
            }));
        } catch (error) {
            console.error(error)
            this.setState({error: 'У вас уже есть плейлист с таким названием'})
        }
    })

    onInput = (event: Event) => {
        const element = event.target as HTMLInputElement;
        PLAYLIST_CREATE_VALIDATOR.validate(element.name, element.value);
        this.setState({
            error: null
        });
    }

    onChangeImage = (event: Event) => {
        const file = (event.target as HTMLInputElement).files![0];
        PLAYLIST_CREATE_VALIDATOR.validate((event.target as HTMLInputElement).name, file || null);
        this.setState({
            error: null
        });
    }

    render() {
        const vr = PLAYLIST_CREATE_VALIDATOR.result;
        return [
            <Dialog onClose={this.props.onClose}>
                <form className="form form--playlist-create" onSubmit={this.onSubmit}>
                    <h2 className="form__title">Создание плейлиста</h2>
                    <div className="form-input-container--image">
                        <img className="form-input-container--image__image" src={vr.thumbnail.url} alt="200x200" />
                        <label className="form-input-container--image__button" for="thumbnail">
                            <img src="/static/img/pencil.svg" />
                        </label>
                        <input className="form-input-container--image__input" type="file" id="thumbnail" name="thumbnail" accept="image/*" onChange={this.onChangeImage} />
                        {vr.thumbnail.error && <p className="form-input-container--image__error">{vr.thumbnail.error}</p>}
                    </div>
                    <div className="form-input-container">
                        <label className="form-input-container__label" htmlFor="title">Название плейлиста</label>
                        <input className="form-input-container__input" type="text" id="title" name="title" value={vr.title.unprocessed} onInput={this.onInput} />
                        {vr.title.error && <p className="form-input-container__error">{vr.title.error}</p>}
                    </div>
                    <div className="form-input-container form-bottom-container">
                        {this.state.error && <p className="form-input-container__error">{this.state.error}</p>}
                        <Button className="form__apply">Создать</Button>
                    </div>
                </form>
            </Dialog>
        ]
    }
}