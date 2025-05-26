import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import './Section.scss'

export class Section extends Component {
    props: {
        title: string,
        horizontal?: boolean,
        wrap?: boolean,
        all_link?: string,
        [key: string]: any
    }

    render() {
        const sectionClassName = "section" + (this.props.horizontal ? ' section--horizontal' : '') + (this.props.wrap ? ' section--wrap' : '');
        return [
            <section {...this.props} className={sectionClassName}>
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

