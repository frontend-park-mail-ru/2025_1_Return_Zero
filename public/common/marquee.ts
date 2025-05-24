import { PLAYER_STORAGE } from "utils/flux/storages";

export function updateMarquee() {
    document.querySelectorAll('.song-name, .artist-name').forEach(container => {
        const marquee = container.querySelector('.marquee');
        try {
            if (marquee.scrollWidth > container.clientWidth) {
                container.classList.add('is-overflowing');
            } else {
                container.classList.remove('is-overflowing');
            }
        } catch {}
    });
}


export function marqueeHandler() {
    PLAYER_STORAGE.subscribe(
        () => {
            updateMarquee();
        }
    );
}



