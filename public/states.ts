import { State } from './libs/State.ts';
import { User } from './utils/api_types.ts';
import { API } from './utils/api.ts';

export const userState: State<User> = new State(null)
API.getCurrentUser().then((user: User) => user && userState.setState(user));
userState.setState({
    id: 0,
    email: 'aboba@mail.ru',
    username: 'zeritonik',
    avatar: 'https://avatars.githubusercontent.com/u/74821810?v=4'
})