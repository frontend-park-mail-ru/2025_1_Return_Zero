import { requirements } from './requirements';

class InputManipulator {
    markInput = (target: HTMLInputElement, errorMessage?: string) => {
        const validationMessage: HTMLParagraphElement | null = document.querySelector(
            `[name="${target.name}-error"]`
        );
        if (!validationMessage) {
            return;
        }
    
        if (target.name === 'password') {
            const passwordRepeat: HTMLInputElement | null = document.querySelector(
                `[name="passwordRepeat"]`
            );
            if (!passwordRepeat) {
                return; // No need to mark the password during login
            }
            // When the password is changed, automatically update the repeat password field
            if (passwordRepeat.value !== target.value) { 
                this.markInput(passwordRepeat, 'Пароли не совпадают');
            } else {
                this.markInput(passwordRepeat);
            }
        }
    
        if (!errorMessage) {
            validationMessage.textContent = '';
            target.classList.remove('border-error'); 
            return;
        }
    
        validationMessage.textContent = errorMessage;
        target.classList.add('border-error'); 
    }
    
    renderGlobalError(text: string): void {
        const errorMessage: HTMLParagraphElement | null = document.querySelector(
            `[name="global-error"]`
        );
        if (!errorMessage) {
            return;
        }
    
        errorMessage.textContent = text;
        errorMessage.className = 'error-message';
    }
    
    inputListener = (event: Event) => {
        const target: HTMLInputElement | null = event.target as HTMLInputElement;
        if (!target || !target.name || !(target.name in requirements)) {
            return;
        }
    
        const requirement = requirements[target.name as keyof typeof requirements];
        const text: string = target.value;
    
        let errorMessage: string | undefined;
        if (text.length < requirement.minLength || text.length > requirement.maxLength) {
            errorMessage = requirement.errorMessages.length;
        }
        if (requirement.containsLetter && !requirement.containsLetter(text)) {
            errorMessage = requirement.errorMessages.containsLetter;
        }
        if (requirement.containsValidChars && !requirement.containsValidChars(text)) {
            errorMessage = requirement.errorMessages.containsValidChars;
        }
        if (requirement.match) {
            if (target.name === 'passwordRepeat') {
                const password: string | null = (
                    document.querySelector(`[name="password"]`) as HTMLInputElement
                ).value;
                if (password && !requirement.match(text, password)) {
                    errorMessage = requirement.errorMessages.match;
                }
            }
            if (target.name !== 'passwordRepeat' && !requirement.match(text)) {
                errorMessage = requirement.errorMessages.match;
            }
        }
    
        if (errorMessage) {
            this.markInput(target, errorMessage);
            return;
        }
        this.markInput(target);
    }
}

export const inputManipulator = new InputManipulator();

