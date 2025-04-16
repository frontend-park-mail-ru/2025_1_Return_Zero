import { Describer } from "libs/rzv/describers";

export const describers = {
    username: Describer.string()
        .min(3, 'Минимум 3 символа')
        .max(20, 'Максимум 20 символов')
        .characters('a-zA-Z0-9_', 'Только буквы, цифры и подчеркивания')
        .contains('a-z', 'Должна быть хотя бы одна буква')
        .contains('0-9', 'Должна быть хотя бы одна цифра'),
    password: Describer.string()
        .min(4, 'Минимум 4 символа')
        .max(25, 'Максимум 25 символов')
        .characters('a-zA-Z0-9_', 'Только буквы, цифры и подчеркивания'),
    email: Describer.string()
        .email('Некорректная почта'),
}