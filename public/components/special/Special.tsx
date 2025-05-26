import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import './Special.scss';

export class Special extends Component {
    render() {
        return [
            <div class='collections-container section__content'>
                <Link to="/selection/most-liked">
                    <div class='collections collections-container__favourite'>
                    </div>
                    <span>Самое любимое</span>
                </Link>

                <Link to="/selection/most-listened-last-month">
                    <div class='collections collections-container__popular'>
                    </div>
                    <span>Популярное</span>
                </Link>

                <Link to="/selection/most-recent">
                    <div class='collections collections-container__new'>
                    </div>
                    <span>Новинки</span>
                </Link>

                <Link to="/selection/most-liked-last-week">
                    <div class='collections collections-container__week'>
                    </div>
                    <span>Открытия недели</span>
                </Link>

                <Link to="/selection/top-chart">
                    <div class='collections collections-container__top'>
                    </div>
                    <span>Топ чарт</span>
                </Link>
            </div>
        ];
    }
}