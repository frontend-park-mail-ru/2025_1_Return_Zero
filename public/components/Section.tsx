import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import './Section.scss'

export class Section extends Component {
    render() {
        const sectionClassName = this.props.horizontal ? ["section", "section--horizontal"].join(' ') : "section";
        return [
            <section className={sectionClassName}>
                <div className="section__top">
                    <h1 className="section__top__title">{this.props.title}</h1>
                    {this.props.all_link && <Link className="section__top__link" to={this.props.all_link}>Показать все</Link>}
                </div>
                <div className="section__content">
                    {this.props.children}
                </div>
            </section>
        ]
    }
}