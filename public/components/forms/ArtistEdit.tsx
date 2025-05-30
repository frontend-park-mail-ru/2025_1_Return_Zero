import { Component } from "libs/rzf/Component";
import { Button } from "../elements/Button";
import { Dialog } from "../elements/Dialog";

import { getArtistEditValidator } from "utils/validators";

import Dispatcher from "libs/flux/Dispatcher";
import { ACTIONS } from "utils/flux/actions";
import { API } from "utils/api";

import { one_alive_async } from "utils/funcs";

import './ArtistCreate.scss';
import './forms.scss'

export class ArtistEdit extends Component {
    validator = getArtistEditValidator(this.props.artist);
    props: {
        artist: AppTypes.Artist,
        onClose: () => void,
        onEdit: (artist: AppTypes.Artist) => void
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
            const artist = (await API.putLabelArtist(
                this.props.artist.id,
                vr.title.value,
                vr.thumbnail.value
            )).body;
            this.props.onEdit(artist);
            Dispatcher.dispatch(new ACTIONS.CREATE_NOTIFICATION({
                type: 'success',
                message: `Артист "${artist.title}" успешно изменён`
            }));
        } catch (error) {
            console.error(error)
            this.setState({error: error.message})
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
        const { artist } = this.props;
        return [
            <Dialog onClose={this.props.onClose}>
                <form className="form form--artist-create" onSubmit={this.onSubmit}>
                    <h2 className="form__title">Изменение артиста</h2>
                    <div className="form-input-container--image">
                        <img className="form-input-container--image__image" src={vr.thumbnail.url || artist.thumbnail_url} alt="error" />
                        <label className="form-input-container--image__button" for="thumbnail">
                            <img src="/static/img/pencil.svg" />
                        </label>
                        <input className="form-input-container--image__input" type="file" id="thumbnail" name="thumbnail" accept="image/*" onChange={this.onChangeImage} />
                        {vr.thumbnail.error && <p className="form-input-container--image__error">{vr.thumbnail.error}</p>}
                    </div>
                    <div className="form-input-container">
                        <label className="form-input-container__label" htmlFor="title">Псевдоним</label>
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