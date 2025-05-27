import { Component } from "libs/rzf/Component";

import { Section } from "components/elements/Section";
import { ArtistCard } from "components/artist/Artist";
import { Button, ButtonAdd, ButtonDanger } from "../elements/Button";

import { Selective } from "./Selective";

import Dispatcher from "libs/flux/Dispatcher";
import { ACTIONS } from "utils/flux/actions";
import { API } from "utils/api";

import { Validator } from "libs/rzv/Validator";
import { ALBUM_CREATE_VALIDATOR, getTrackCreateValidator } from "utils/validators";

import { one_alive_async } from "utils/funcs";

import './forms.scss'
import './AlbumCreate.scss';
import { Preloader } from "components/preloader/Preloader";

export class AlbumCreate extends Component {
    state = {
        artists: [] as AppTypes.Artist[],
        artists_loading: true as boolean,

        selected_artists: [] as AppTypes.Artist[],
        selected_artists_error: null as string | null,
        tracks_validators: [getTrackCreateValidator()],
        error: null as string | null
    }

    componentDidMount(): void { this.fetchData(); }
    fetchData() {
        this.setState({artists_loading: true})
        API.getLabelArtists(100).then((resp) => this.setState({artists: resp.body}))
            .catch(e => this.setState({artists: []}))
            .finally(() => this.setState({artists_loading: false}));
    };

    onSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        this._onSubmit();
    };

    _onSubmit = one_alive_async(async () => {
        if (!this.state.selected_artists.length) {
            this.setState({
                selected_artists_error: 'Выберите хотя бы одного исполнителя'
            })
            return;
        }
        if (!this.state.tracks_validators.length) {
            this.setState({
                error: "Альбом не может быть пустым"
            })
            return
        }
        if (!ALBUM_CREATE_VALIDATOR.validateAll() || !this.state.tracks_validators.every(v => v.validateAll())) {
            this.setState({
                error: 'Заполните все поля'
            })
            return;
        }

        try {
            const vr = ALBUM_CREATE_VALIDATOR.result
            const album = (await API.postLabelAlbum(
                vr.title.value,
                vr.type.value,
                vr.thumbnail.value,
                this.state.selected_artists.map(({id}) => id),
                this.state.tracks_validators.map(v => ({
                    title: v.result.title.value,
                    track: v.result.track.value,
                }))
            )).body;
            Dispatcher.dispatch(new ACTIONS.CREATE_NOTIFICATION({
                type: 'success',
                message: `Альбом ${album.title} успешно создан`
            }));
            ALBUM_CREATE_VALIDATOR.clear();
            this.props.onCreate(album);
            // reset
            this.state.tracks_validators.forEach(v => v.clear())
            this.setState({
                selected_artists: [],
                selected_artists_error: null,
                tracks_validators: [getTrackCreateValidator()],
                error: null
            })
        } catch (error) {
            console.error(error)
            this.setState({error: error.message})
        }
    })

    onInput = (event: Event) => {
        const element = event.target as HTMLInputElement;
        ALBUM_CREATE_VALIDATOR.validate(element.name, element.value);
        this.setState({
            error: null
        });
    }

    onSelect = ({artist}: {artist: AppTypes.Artist}, selected: boolean) => {
        this.setState({
            selected_artists: selected
                ? [...this.state.selected_artists, artist]
                : this.state.selected_artists.filter(({id}) => id !== artist.id),
            error: null
        })
    }

    onChangeImage = (event: Event) => {
        const file = (event.target as HTMLInputElement).files![0];
        ALBUM_CREATE_VALIDATOR.validate((event.target as HTMLInputElement).name, file || null);
        this.setState({
            error: null
        });
    }

    render() {
        const vr = ALBUM_CREATE_VALIDATOR.result;
        return [
            <form className="form form--album-create" onSubmit={this.onSubmit}>
                <div className="form--album-create__info">
                    <div className="form-input-container--image">
                        <img className="form-input-container--image__image" src={vr.thumbnail.url} alt="200x200" />
                        <label className="form-input-container--image__button" for="thumbnail1">
                            <img src="/static/img/pencil.svg" />
                        </label>
                        <input className="form-input-container--image__input" type="file" id="thumbnail1" name="thumbnail" accept="image/*" onChange={this.onChangeImage} />
                        {vr.thumbnail.error && <p className="form-input-container--image__error">{vr.thumbnail.error}</p>}
                    </div>
                    <div className="form-input-container">
                        <label className="form-input-container__label" htmlFor="title1">Название альбома</label>
                        <input className="form-input-container__input" type="text" id="title1" name="title" placeholder="название" value={vr.title.unprocessed} onInput={this.onInput} />
                        {vr.title.error && <p className="form-input-container__error">{vr.title.error}</p>}
                    </div>
                    <div className="form-input-container">
                        <label className="form-input-container__label" htmlFor="type">Тип альбома</label>
                        <select className="form-input-container__select" name="type" id="type" onChange={this.onInput} required>
                            <option disabled selected hidden>выберите</option>
                            <option value="album">Альбом</option>
                            <option value="single">Сингл</option>
                            <option value="ep">EP</option>
                            <option value="compilation">Компилляция</option>
                        </select>
                    </div>
                </div>
                <Section title="Главный артист">
                    {!!this.state.selected_artists.length && <ArtistCard artist={this.state.selected_artists[0]} />}
                </Section>
                {this.state.selected_artists_error && <p className="form-input-container--image__error">Артист не выбран</p>}
                <Section title="Остальные артисты">
                    {this.state.selected_artists.length > 1 && this.state.artists.slice(1).map(a => <ArtistCard artist={a} />)}
                </Section>
                <Section title="Выберете артистов" horizontal wrap >
                    {!this.state.artists_loading ? 
                        this.state.artists.map(a => <Selective onSelect={this.onSelect} props={{artist: a}} component={ArtistCard} selected={this.state.selected_artists.includes(a)} />) :
                        <Preloader />}
                </Section>
                <Section title="Треки альбома">
                    {this.state.tracks_validators.map((vl, i) => 
                        <TrackCreate ind={i + 1} validator={vl} onRemove={(v: Validator) => 
                            this.setState({ tracks_validators: this.state.tracks_validators.filter(vl => vl != v)})} 
                        />)}
                    <ButtonAdd type="button" onClick={() => this.setState({ tracks_validators: [...this.state.tracks_validators, getTrackCreateValidator()] })} />
                </Section>
                <div className="form-input-container form-bottom-container">
                    {this.state.error && <p className="form-input-container__error">{this.state.error}</p>}
                    <Button className="form__apply">Создать альбом</Button>
                </div>
            </form>
        ]
    }
}

class TrackCreate extends Component {
    props: {
        ind: number,
        validator: Validator,
        onRemove: (v: Validator) => void
    }

    state = {
        error: null as string | null
    }

    onInput = (event: Event) => {
        const element = event.target as HTMLInputElement;
        this.props.validator.validate(element.name, element.value);
        this.setState({
            error: null
        });
    }

    onChangeFile = (event: Event) => {
        const file = (event.target as HTMLInputElement).files![0];
        this.props.validator.validate('track', file);
        this.setState({
            error: null
        })
    }

    remove = () => this.props.onRemove(this.props.validator)

    render() {
        const vr = this.props.validator.result;
        return [
            <Section title="" className="form--album-create__track" horizontal wrap>
                <div className="form-input-container">
                    <label className="form-input-container__label" htmlFor="title">Название трека №{this.props.ind}</label>
                    <input className="form-input-container__input" type="text" id="title" name="title" placeholder={`трек №${this.props.ind}`} value={vr.title.unprocessed} onInput={this.onInput} />
                    {vr.title.error && <p className="form-input-container__error">{vr.title.error}</p>}
                </div>
                <div className="form-input-container">
                    <label className="form-input-container__label" htmlFor="track">Файл mp3</label>
                    <input className="form-input-container__input" type="file" id="track" name="track" accept="audio/mpeg" onChange={this.onChangeFile} />
                    {vr.track.error && <p className="form-input-container__error">{vr.track.error}</p>}
                </div>
                <ButtonDanger type="button" onClick={this.remove}>Убрать</ButtonDanger>
            </Section>
        ]
    }
}
