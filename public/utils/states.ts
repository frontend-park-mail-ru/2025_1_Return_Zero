import { State } from '../libs/State';
import { DataTypes, TemplateAPI } from './api_types';
import { API } from './api';

export const userState: State<DataTypes.User> = new State(null)
API.getCurrentUser().then((user: TemplateAPI.UserResponse) => {
    userState.setState(user.body);
}).catch(() => userState.setState(null));