import { Component } from "libs/rzf/Component";
import { Button } from "../elements/Button";
import { Popup } from "../elements/Popup";

import './PlaylistCreate.scss';
import './forms.scss'

export class PlaylistCreate extends Component {
    props: {
        onClose: () => void,
        onCreate: (playlist: AppTypes.Playlist) => void
    }
    state = {
        img_url: "https://placehold.jp/99c1f1/ffffff/200x200.png",
        error: null as string | null
    }

    onClose = (e: MouseEvent) => {
        if (e.target instanceof HTMLElement && e.target.classList.contains("popup")) {
            this.props.onClose();
        }
    }

    onSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        this.props.onCreate(undefined);
    }

    onChangeImage = (event: Event) => {
        const file = (event.target as HTMLInputElement).files![0];
        if (file.size > 5 * 1024 * 1024) {
            this.setState({
                error: 'Файл слишком большой'
            })
            return
        }
        URL.revokeObjectURL(this.state.img_url);
        this.setState({
            img_url: URL.createObjectURL(file),
            error: null
        })
    }

    render() {
        return [
            <Popup className="popup--playlist-create" onClick={this.onClose}>
                <form className="form form--playlist-create" onSubmit={this.onSubmit}>
                    <h2 className="form__title">Создание плейлиста</h2>
                    <div className="form-input-container--image">
                        <img className="form-input-container--image__image" src={this.state.img_url} />
                        <label className="form-input-container--image__button" for="avatar">
                            <img src="/static/img/pencil.svg" />
                        </label>
                        <input className="form-input-container--image__input" type="file" id="avatar" accept="image/*" onChange={this.onChangeImage} />
                        <p className="form-input-container--image__error"></p>
                    </div>
                    <div className="form-input-container">
                        <label className="form-input-container__label" htmlFor="title">Название плейлиста</label>
                        <input className="form-input-container__input" type="text" id="title" name="title" />
                    </div>
                    <div className="form-input-container form-bottom-container">
                        {this.state.error && <p className="form-input-container__error">{this.state.error}</p>}
                        <Button className="form__apply">Создать</Button>
                    </div>
                </form>
            </Popup>
        ]
    }
}