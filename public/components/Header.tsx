import { Component } from "libs/rzf/Component";
import router, { Link } from "libs/rzf/Router";

import { Button } from "components/elements/Button";

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
                <div className="header__auth">
                    <Button onClick={() => router.push(location.pathname+'#login', {})} className="header__auth__login">Войти</Button>
                    <Button onClick={() => router.push(location.pathname+'#register', {})} className="header__auth__register">Регистрация</Button>
                </div>
            </header>
        ];
    }
}

class NavItem extends Component {
    render() {
        console.log(location.pathname, this.props.link)
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