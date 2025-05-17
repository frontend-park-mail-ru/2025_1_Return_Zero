import { Component } from "libs/rzf/Component";
import { Button } from "../elements/Button";
import { Dialog } from "../elements/Dialog";

import { getPlaylistEditValidator } from "utils/validators";

import Dispatcher from "libs/flux/Dispatcher";
import { ACTIONS } from "utils/flux/actions";
import { API } from "utils/api";

import { one_alive_async } from "utils/funcs";

import './PlaylistCreate.scss';
import './forms.scss'

export class PlaylistEdit extends Component {
    validator = getPlaylistEditValidator(this.props.playlist);

    props: {
        playlist: AppTypes.Playlist,
        onClose: () => void,
        onSave: (playlist: AppTypes.Playlist) => void
    }
    state = {
        error: null as string | null
    }

    onSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        this._onSubmit();
    };

    _onSubmit = one_alive_async(async () => {
        if (!this.validator.validateAll()) {
            this.setState({
                error: 'Заполните все поля'
            })
            return;
        }

        try {
            const vr = this.validator.result
            const playlist = (await API.putPlaylist(
                this.props.playlist.id,
                vr.title.value,
                vr.thumbnail.value
            )).body;
            this.props.onSave(playlist);
            Dispatcher.dispatch(new ACTIONS.EDIT_PLAYLIST(playlist));
            Dispatcher.dispatch(new ACTIONS.CREATE_NOTIFICATION({
                type: 'success',
                message: `Плейлист успешно изменён`
            }));
        } catch (error) {
            this.setState({error: 'Что-то пошло не так'})
        }
    })

    onInput = (event: Event) => {
        const element = event.target as HTMLInputElement;
        this.validator.validate(element.name, element.value);
        this.setState({
            error: null
        });
    }

    onChangeImage = (event: Event) => {
        const file = (event.target as HTMLInputElement).files![0];
        this.validator.validate((event.target as HTMLInputElement).name, file || null);
        this.setState({
            error: null
        });
    }

    render() {
        const vr = this.validator.result;
        const playlist = this.props.playlist;
        return [
            <Dialog onClose={this.props.onClose}>
                <form className="form form--playlist-create" onSubmit={this.onSubmit}>
                    <h2 className="form__title">Изменение плейлиста</h2>
                    <div className="form-input-container--image">
                        <img className="form-input-container--image__image" src={vr.thumbnail.url || playlist.thumbnail_url} alt="200x200" />
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
                        <Button className="form__apply">Изменить</Button>
                    </div>
                </form>
            </Dialog>
        ]
    }
}