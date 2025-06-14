import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import './Section.scss'

export class Section extends Component {
    props: {
        title: string,
        horizontal?: boolean,
        wrap?: boolean,
        all_link?: string,
        is_loading?: boolean,
        [key: string]: any
    }

    render() {
        const sectionClassName = "section" + (this.props.horizontal ? ' section--horizontal' : '') + (this.props.wrap ? ' section--wrap' : '')
            + (this.props.className ? ' ' + this.props.className : '');
        return [
            <section {...this.props} className={sectionClassName}>
                <div className="section__top">
                    <h1 className="section__top__title">{this.props.title}</h1>
                    {this.props.all_link && <Link className="section__top__link" to={this.props.all_link}>Показать все</Link>}
                </div>
                <div className="section__content">
                    {this.props.is_loading 
                        ? <div className="section__skeleton"></div>
                        : (this.props.children.length ? this.props.children : <span className="section__empty">Здесь пока ничего нет</span>)}
                </div>
            </section>
        ]
    }
}

