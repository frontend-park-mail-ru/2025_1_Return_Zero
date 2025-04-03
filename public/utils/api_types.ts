export type Track = {
    id: number;
    title: string;
    artist: string;
    image: string;
};

export type Album = {
    id: number;
    title: string;
    artist: string;
    image: string;
};

export type Artist = {
    id: number;
    title: string;
    image: string;
};

export type User = {
    id: number;
    email: string;
    username: string;
};

export type AuthSendingData = {
    identifier?: string,
    username?: string,
    email?: string,
    password?: string,
    passwordRepeat?: string
}

