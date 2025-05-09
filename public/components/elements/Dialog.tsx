import { Component } from "libs/rzf/Component";

import './Dialog.scss'

export class Dialog extends Component {
    props: {
        onClose?: (e: Event) => void;
        [key: string]: any
    }
    
    onClose = (e: Event) => { this.props.onClose && this.props.onClose(e) }
    onInner = (e: Event) => e.stopPropagation()

    render() {
        const {className, children, onClose, ...props} = this.props
        return [
            <div className={className ? 'dialog ' + className : 'dialog'} {...props} onMouseDown={this.onClose}>
                <div className='dialog__container' onMouseDown={this.onInner}>
                    {children}
                </div>
            </div>
        ]
    }
}