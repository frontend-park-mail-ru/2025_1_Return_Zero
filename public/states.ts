import { State } from './libs/State.ts';
import { User } from './utils/api_types.ts';
import { API } from './utils/api.ts';

export const userState: State<User> = new State(null)
API.getCurrentUser().then((user: User) => user && userState.setState(user));