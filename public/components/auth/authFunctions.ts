import Router from 'libs/Router';

function renderGlobalError(text: string): void {
    const errorMessage: HTMLParagraphElement | null = document.querySelector(
        `[name="global-error"]`
    );
    if (!errorMessage) {
        return;
    }

    errorMessage.textContent = text;
    errorMessage.className = 'error-message';
}

function formClickListener(event: Event): void {
    const authWindow = document.getElementById('auth') as HTMLDivElement ?? null;

    if (authWindow && event.target instanceof Node && !authWindow.contains(event.target)) {
        const authForm = event.currentTarget as HTMLFormElement ?? null;

        if (authForm && event.currentTarget instanceof Node) {
            authForm.removeEventListener('mousedown', this.formClickListener);
            
            const parent = authForm.parentNode; 
            if (parent) {
                Router.pushUrl(
                    '/', {} 
                );
            }
        }
    }
}

export { renderGlobalError, formClickListener }

