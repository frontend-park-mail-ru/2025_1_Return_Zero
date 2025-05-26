import { ButtonDanger, ButtonSuccess } from "components/elements/Button";
import { Dialog } from "components/elements/Dialog";
import Dispatcher from "libs/flux/Dispatcher";
import Router from "libs/rzf/Router";
import { Component } from "libs/rzf/Component";

export class JamForm extends Component {
    onSubmit(e: SubmitEvent) {
        e.preventDefault();

        const submitter = e.submitter as HTMLButtonElement;
        if (submitter.classList.contains('button--success')) {
            this.props.onEnter();
        } else {
            Router.push('/', {});
        }
    }

    render() {
        return [
            <Dialog>
                <form className="form form--auth" onSubmit={this.onSubmit.bind(this)}>
                    <h2 className="form__title">Начать прослушивание?</h2>
                    <ButtonSuccess className="form__apply">Войти</ButtonSuccess>
                    <ButtonDanger className="form__apply">Выйти</ButtonDanger>
                </form>
            </Dialog>
        ];
    }
}

