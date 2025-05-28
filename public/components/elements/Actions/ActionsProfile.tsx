import { Component } from "libs/rzf/Component";
import { Link } from "libs/rzf/Router";

import { Actions, ActionsCopyLink } from "./Actions";

import Dispatcher from "libs/flux/Dispatcher";
import { ACTIONS } from "utils/flux/actions";
import { USER_STORAGE, PLAYER_STORAGE } from "utils/flux/storages";

import { debounce } from "utils/funcs";
import { API } from "utils/api";


export class ActionsProfile extends Component {
    props: {
        user: AppTypes.User;
        [key: string]: any;
    }

    render() {
        const { user } = this.props;
        return [
            <Actions>
                <ActionsCopyLink link={URL.parse(`/profile/${user.username}`, location.href).toString()} />
                {USER_STORAGE.getUser()?.is_label && <Link to="/label" className="actions-item">К лейблу</Link>}
            </Actions>
        ]
    }
}
