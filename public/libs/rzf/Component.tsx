import h from './jsx';
import * as VDom from './VDom';
import { config } from './rzf_config';

export interface ComponentConstructor {
    new(props: any, ...args: any[]): Component;
}

export type ComponentChild = VDom.Node | string

export type ComponentRender = () => VDom.Node


export class Component {
    props: any;
    state: any;
    children: any[];

    constructor(props: any={}, children: any[]=[]) {
        this.props = props;
        this.state = {};
        this.children = children;
    }

    componentDidMount() {
        config.verboseComponent && console.log(`{${this.constructor.name}} componentDidMount`)
    }
    componentWillUnmount() {
        config.verboseComponent && console.log(`{${this.constructor.name}} componentWillUnmount`)
    }

    shouldComponentUpdate(props: any, state: any) {
        return true;
    }

    setState(state: any) {
        this.state = {
            ...this.state,
            ...(typeof state === 'function' ? state(this.state, this.props) : state),
        }
        config.verboseComponent && console.log(`{${this.constructor.name}} setState`, this.state);
    }
    
    render(): VDom.Node {
        return (
            <div>
                <h1 style={{ color: 'red' }}>Rzf Component</h1>
            </div>
        )
    }
}