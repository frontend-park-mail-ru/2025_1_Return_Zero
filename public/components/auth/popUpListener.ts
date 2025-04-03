class PopUpListener {
    /**
     * Removes the authentication form from the DOM when it is clicked outside of it.
     * @param {Event} event - The event triggered by the click.
     */
    formClickListener = (event: Event) => {
        const authWindow = document.getElementById('auth') as HTMLDivElement ?? null;
    
        if (authWindow && event.target instanceof Node && !authWindow.contains(event.target)) {
            const authForm = event.currentTarget as HTMLFormElement ?? null;
    
            if (authForm && event.currentTarget instanceof Node) {
                authForm.removeEventListener('mousedown', this.formClickListener);
                
                const parent = authForm.parentNode; 
                if (parent) {
                    parent.removeChild(authForm); 
                }
    
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

