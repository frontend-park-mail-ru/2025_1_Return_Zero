import { Component } from "libs/rzf/Component";
import { Button, ButtonDanger } from "./Button";

import './Dialog.scss'

export class Dialog extends Component {
    props: {
        onClose?: (e: Event) => void;
        [key: string]: any
    }
    
    onClose = (e: Event) => { this.props.onClose && this.props.onClose(e) }
    onInner = (e: Event) => { e.stopPropagation()}

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

export class DialogConfirm extends Component {
    props: {
        message?: string;
        onClose: (e: Event) => void;
        onConfirm: (e: Event) => void;
        [key: string]: any
    }

    render() {
        const {className, onClose, onConfirm, ...props} = this.props
        return [
            <Dialog {...props} onClose={onClose} className={'dialog--confirm'}>
                {this.props.message && <h2>{this.props.message}</h2>}
                {this.props.children}
                <div className="dialog--confirm__actions">
                    <Button onClick={onClose}>Отменить</Button>
                    <ButtonDanger onClick={onConfirm}>Подтвердить</ButtonDanger>
                </div>
            </Dialog>
        ]
    }
}
