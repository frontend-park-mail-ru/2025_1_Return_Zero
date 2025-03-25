class PopUpListener {
    /**
     * Removes the authentication form from the DOM when it is clicked outside of it.
     * @param {Event} event - The event triggered by the click.
     */
    formClickListener = (event: Event) => {
        const authWindow: HTMLDivElement | null = document.getElementById('auth') as HTMLDivElement;;

        if (authWindow && event.target instanceof Node && !authWindow.contains(event.target)) {
            const root: HTMLDivElement | null = document.getElementById('root') as HTMLDivElement;
            const authForm: HTMLFormElement | null = event.currentTarget as HTMLFormElement;

            if (authForm && event.currentTarget instanceof Node) {
                authForm.removeEventListener('mousedown', this.formClickListener);
                root.removeChild(event.currentTarget);

                document
                .querySelectorAll('.header__login.active, .header__signup.active')
                .forEach((button) => {
                    button.classList.remove('active');
                });
            }
        }
    }
}

export const popUpListener = new PopUpListener();

