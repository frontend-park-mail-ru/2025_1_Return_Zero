import { Component } from "libs/rzf/Component";

import './Special.scss';

export class Special extends Component {
    render() {
        return [
            <div class='collections-container section__content'>
                <div>
                    <div class='collections collections-container__favourite'>
                    </div>
                    <span>Самое любимое</span>
                </div>

                <div>
                    <div class='collections collections-container__popular'>
                    </div>
                    <span>Популярное</span>
                </div>

                <div>
                    <div class='collections collections-container__new'>
                    </div>
                    <span>Новинки</span>
                </div>

                <div>
                    <div class='collections collections-container__week'>
                    </div>
                    <span>Открытия недели</span>
                </div>

                <div>
                    <div class='collections collections-container__top'>
                    </div>
                    <span>Топ чарт</span>
                </div>
            </div>
        ];
    }
}