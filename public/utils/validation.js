/**
 * Validates user inputs based on a validation list.
 *
 * @param {HTMLFormElement} form - The form element containing the inputs.
 * @param {Array<{ name: string, type: string }>} validationList - The list of input fields to validate.
 * @param {Object} sendingData - The object where validated input values will be stored.
 *
 * @returns {{ message: string, errorInputName: string }} The validation result with a success message or an error message and errorInput name.
 */
export function validate(form, validationList, sendingData) {
    let message;
    let errorInputName;
    validationList.forEach(({ name, type }) => {
        const input = form.querySelector(`[name="${name}"]`);

        // Checking if input's types wasn't changed. We trust html types validation
        if (!input) {
            message = `Input with name "${name}" not found`;
            errorInputName = name;
            return;
        }

        if (input.type !== type) {
            message = `Input type mismatch for "${name}". Expected "${type}", but found "${input.type}"`;
            errorInputName = name;
            return;
        }

        // Validating
        const validationResult = validateInput(
            input.value.trim(),
            name,
            input.name === 'passwordRepeat'
                ? input.form.password?.value.trim()
                : undefined
        );
        if (validationResult !== 'success') {
            message = validationResult;
            errorInputName = name;
            return;
        }

        // Adding to sending data
        if (name in sendingData) {
            sendingData[name] = input.value;
        }
    });

    if (!message) {
        message = 'success';
    }
    return { message, errorInputName };
}

/**
 * Validates user input based on requirements.
 *
 * @param {string} text - The input text to validate.
 * @param {string} type - The type of input being validated ("username", "password", "passwordRepeat", etc.).
 * @param {string} [matchingValue] - The value to match against (used for password confirmation).
 *
 * @returns {string} An error message if validation fails, otherwise "success".
 */
function validateInput(text, type, matchingValue) {
    const validLetters = new Set([
        ...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    ]);

    const validLoginChars = new Set([...validLetters, '_', ...'0123456789']);

    const validEmailChars = new Set([...validLoginChars, ...'@#!.']);

    const globalValidLoginCharsChecker = (text) => {
        if (typeof text !== 'string') {
            return false;
        }

        return [...text].every((char) => validLoginChars.has(char));
    };

    const globalValidEmailCharsChecker = (text) => {
        if (typeof text !== 'string') {
            return false;
        }

        return [...text].every((char) => validEmailChars.has(char));
    };

    const globalLetterChecker = (text) => {
        if (typeof text !== 'string') {
            return false;
        }

        return [...text].some((char) => validLetters.has(char));
    };

    const requirements = {
        password: {
            minLength: 4,
            maxLength: 25,
            containsLetter: globalLetterChecker,
            containsValidChars: globalValidLoginCharsChecker,
        },

        passwordRepeat: {
            matches: (text) => {
                return text === matchingValue;
            },
        },

        username: {
            minLength: 3,
            maxLength: 20,
            containsLetter: globalLetterChecker,
            containsValidChars: globalValidLoginCharsChecker,
        },

        email: {
            minLength: 5,
            maxLength: 30,
            containsValidChars: globalValidEmailCharsChecker,
        },

        identifier: {
            minLength: 3,
            maxLength: 20,
            containsValidChars: globalValidEmailCharsChecker,
        },
    };

    switch (type) {
        case 'username':
            const usernameRequirements = requirements.username;
            if (
                text.length < usernameRequirements.minLength ||
                text.length > usernameRequirements.maxLength
            ) {
                return `Логин должно быть от ${usernameRequirements.minLength} до ${usernameRequirements.maxLength} символов`;
            }
            if (!usernameRequirements.containsValidChars(text)) {
                return 'Логин может содержать только латинские буквы, цифры и подчеркивания';
            }
            if (!usernameRequirements.containsLetter(text)) {
                return 'Логин должен содержать хотя бы одну букву';
            }
            break;

        case 'password':
            const passwordRequirements = requirements.password;
            if (
                text.length < passwordRequirements.minLength ||
                text.length > passwordRequirements.maxLength
            ) {
                return `Пароль должен быть от ${passwordRequirements.minLength} до ${passwordRequirements.maxLength} символов`;
            }
            if (!passwordRequirements.containsValidChars(text)) {
                return 'Пароль может содержать только латинские буквы, цифры и подчеркивания';
            }
            if (!passwordRequirements.containsLetter(text)) {
                return 'Пароль должен содержать хотя бы одну букву';
            }
            break;

        case 'email':
            const emailRequirements = requirements.email;
            if (
                text.length < emailRequirements.minLength ||
                text.length > emailRequirements.maxLength
            ) {
                return `Email должен быть от ${emailRequirements.minLength} до ${emailRequirements.maxLength} символов`;
            }
            if (!emailRequirements.containsValidChars(text)) {
                return 'Введите корректный email';
            }
            break;

        case 'identifier':
            const identifierRequirements = requirements.identifier;
            if (
                text.length < identifierRequirements.minLength ||
                text.length > identifierRequirements.maxLength
            ) {
                return `Логин/email должен быть от ${identifierRequirements.minLength} до ${identifierRequirements.maxLength} символов`;
            }
            if (!identifierRequirements.containsValidChars(text)) {
                return 'Логин/email может содержать только латинские буквы, цифры и подчеркивания';
            }
            break;

        case 'passwordRepeat':
            const passwordRepeatRequirements = requirements.passwordRepeat;
            if (!passwordRepeatRequirements.matches(text)) {
                return 'Пароли не совпадают';
            }
            break;

        default:
            return 'Неизвестный параметр';
    }

    return 'success';
}