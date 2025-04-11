import { State } from '../libs/State';
import { DataTypes } from './api_types';
import { API } from './api';

export const userState: State<DataTypes.User> = new State(null)
API.getCurrentUser().then((user: DataTypes.User) => user && userState.setState(user));
userState.setState({
    id: 0,
    email: 'aboba@mail.ru',
    username: 'zeritonik',
    avatar: 'https://avatars.githubusercontent.com/u/74821810?v=4'
})