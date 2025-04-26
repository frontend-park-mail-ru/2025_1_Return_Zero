import * as rzv from "libs/rzv/rzv";

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 20;
const USERNAME_SYMBOLS = 'a-zA-Z0-9_';

const PASSWORD_MIN_LENGTH = 4;
const PASSWORD_MAX_LENGTH = 25;
const PASSSWORD_SYMBOLS = 'a-zA-Z0-9_';
const PASSWORD_CONTAINS_NUMBER = '0-9';
const PASSWORD_CONTAINS_LETTER = 'a-zA-Z';

export const LOGIN_FORM_VALIDATOR = new rzv.Validator({
    'identifier': rzv.string().required().or([
        d => d.email(),
        d => d.min(USERNAME_MIN_LENGTH).max(USERNAME_MAX_LENGTH).consistOf(USERNAME_SYMBOLS)
    ], 'Invalid identifier'),
    'password': rzv.string().required().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH).consistOf(PASSSWORD_SYMBOLS)
        .containsOneOf(PASSWORD_CONTAINS_NUMBER).containsOneOf(PASSWORD_CONTAINS_LETTER)
});

export const REGISTRATION_FORM_VALIDATOR = new rzv.Validator({
    'username': rzv.string().required().min(USERNAME_MIN_LENGTH).max(USERNAME_MAX_LENGTH).consistOf(USERNAME_SYMBOLS),
    'email': rzv.string().required().email(),
    'password': rzv.string().required().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH).consistOf(PASSSWORD_SYMBOLS)
        .containsOneOf(PASSWORD_CONTAINS_NUMBER).containsOneOf(PASSWORD_CONTAINS_LETTER),
    'repeatPassword': rzv.string().required().oneof([rzv.ref('password')], 'Пароли не совпадают')
});
