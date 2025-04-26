import { Component } from "libs/rzf/Component";
import router, { Link } from "libs/rzf/Router";

import { Button } from "components/elements/Button";

import { USER_STORAGE } from "utils/flux/storages";

import "./Header.scss";

export class Header extends Component {
    render() {
        return [
            <header className="header">
                <div className="header__logo">
                    <Link to='/'><img src="/static/img/logo.png" alt="Return Zero" /></Link>
                </div>
                <form className="header__search">
                    <img className="header__search__icon" src="/static/img/icon-search.svg" />
                    <input className="header__search__input" type="text" placeholder="Поиск..." />
                </form>
                <nav className="header__nav">
                    <NavItem link="/" icon="/static/img/icon-home.svg" text="Главная" />
                    <NavItem link="/tracks" icon="/static/img/icon-tracks.svg" text="Треки" />
                    <NavItem link="/albums" icon="/static/img/icon-albums.svg" text="Альбомы" />
                    <NavItem link="/artists" icon="/static/img/icon-artists.svg" text="Артисты" />
                </nav>
                <HeaderProfile />
            </header>
        ];
    }
}

class NavItem extends Component {
    render() {
        return [
            <div className={"header__nav__item" + (location.pathname === this.props.link ? " active" : "")}>
                <Link to={this.props.link}>
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
        USER_STORAGE.unSubscribe(this.createdUserCallback);
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
            </div> 
        ]
    }

    renderProfile(user: AppTypes.User) {
        return [
            <div className="header__profile" onClick={() => this.setState({ opened: !this.state.opened })}>
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