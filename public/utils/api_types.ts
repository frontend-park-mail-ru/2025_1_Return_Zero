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

export type LoginData = {
    login: string;
    email: string;
    password: string;
};

export type SignupData = {
    email: string;
    username: string;
    password: string;
};
