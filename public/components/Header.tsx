import { Component } from "libs/rzf/Component";
import router, { Route, Link } from "libs/rzf/Router";

import { Button } from "components/elements/Button";
import { HeaderLogo } from "components/logo/HeaderLogo";

import { USER_STORAGE } from "utils/flux/storages";
import { debounce } from "utils/funcs";

import "./Header.scss";

export class Header extends Component {
    render() {
        return [
            <header className="header">
                <HeaderLogo />
                <HeaderSearch />
                <nav className="header__nav">
                    <Route path="^/" exact component={NavItem} elseComponent={NavItem} link="/" icon="/static/img/icon-home.svg" text="Главная" />
                    <Route path="^/tracks/" exact component={NavItem} elseComponent={NavItem} link="/tracks" icon="/static/img/icon-tracks.svg" text="Треки" />
                    <Route path="^/albums/" exact component={NavItem} elseComponent={NavItem} link="/albums" icon="/static/img/icon-albums.svg" text="Альбомы" />
                    <Route path="^/artists/" exact component={NavItem} elseComponent={NavItem} link="/artists" icon="/static/img/icon-artists.svg" text="Артисты" />
                </nav>
                <HeaderProfile />
            </header>
        ];
    }
}

class HeaderSearch extends Component {
    componentDidMount(): void {
        setInterval(() => {
            const input = document.querySelector('.header__search') as HTMLInputElement | null;
            const logo = document.querySelector('.header-logo') as HTMLElement | null;
            if (window.innerWidth <= 600) {
                const locations = ['/search/all', '/search/tracks/', '/search/artists', '/search/albums'];
                if (locations.includes(location.pathname)) {
                    if (logo && input) {
                        input.style.display = 'flex';
                        logo.style.display = 'none';
                    }
                } else {
                    if (logo && input) {
                        input.style.display = 'none';
                        logo.style.display = 'flex';
                    }
                }
            } else {
                if (logo && input) {
                    input.style.display = 'flex';
                    logo.style.display = 'none';
                }
            }
        }, 300);
    }

    state = {
        query: "",
    }

    onSubmit = (e: Event) => {
        e.preventDefault();
        this._onSubmit();
    }

    onInput = (e: Event) => {
        const target = (e.target as HTMLInputElement).value;
        if (!this.state.query && target) {
            router.push('/search/all', {});
        }
        this.setState({ query: target });
        this._onSubmit();
    }

    _onSubmit = debounce(() => {
        if (!this.state.query) { 
            router.push('/', {});
            return;
        }
        router.replace(`?query=${this.state.query}`, {})
    })

    onFocus = () => {
        router.push(`/search/all?query=${this.state.query}`, {});
    }

    render() {
        return [
            <form className="header__search" onSubmit={this.onSubmit}>
                <img className="header__search__icon" src="/static/img/icon-search.svg" />
                <input className="header__search__input" onFocus={this.onFocus} value={this.state.query} onInput={this.onInput} type="text" placeholder="поиск..." />
            </form>
        ]
    }
}

class NavItem extends Component {
    render() {
        return [
            <div className={"header__nav__item" + (location.pathname === this.props.link ? " active" : "")}>
                <Link class="header__nav__item__link" to={this.props.link}>
                    <img src={this.props.icon} />
                    <span>{this.props.text}</span>
                </Link>
            </div>
        ];
    }
}

class HeaderProfile extends Component {
    createdUserCallback: any = undefined;

    constructor(props: Record<string, any>) {
        super(props);
        this.state = {
            opened: false,
        }
    }

    componentDidMount(): void {
        this.createdUserCallback = this.userCallback.bind(this);
        USER_STORAGE.subscribe(this.createdUserCallback);
    }
    componentWillUnmount(): void {
        USER_STORAGE.unsubscribe(this.createdUserCallback);
        this.createdUserCallback = undefined;
    }

    userCallback() {
        this.setState({});
    }

    render() {
        const user = USER_STORAGE.getUser();
        if (user) return this.renderProfile(user);
        return this.renderAuth();
    }

    renderAuth() {
        return [
            <div className="header__auth">
                <Button onClick={() => router.push(location.pathname+'#login', {})} className="header__auth__login">Войти</Button>
                <Button onClick={() => router.push(location.pathname+'#register', {})} className="header__auth__register">Регистрация</Button>
                <Button onClick={() => router.push(location.pathname+'#login', {})} className="header__auth__icon"></Button>
            </div> 
        ]
    }

    renderProfile(user: AppTypes.User) {
        return [
            <div className="header__profile" onClick={() => this.setState({ opened: !this.state.opened })} onClickOutside={() => this.setState({ opened: false })}>
                <img src={user.avatar_url} className="header__profile__avatar" />
                {this.state.opened && <div className="header__profile__menu">
                    <Link className="item" to={"/profile/" + user.username}>
                        <img src='/static/img/icon-profile.svg' />
                        <span>Профиль</span>
                    </Link>
                    <Link className="item" to="/settings">
                        <img src='/static/img/icon-settings.svg' />
                        <span>Настройки</span>
                    </Link>
                    <div className="header__profile__menu__separator"></div>
                    <Link className="item" to="#logout">
                        <img src='/static/img/icon-logout.svg' />
                        <span>Выйти</span>
                    </Link>
                </div>}
            </div>
        ]
    }
}

