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

export { renderGlobalError };
