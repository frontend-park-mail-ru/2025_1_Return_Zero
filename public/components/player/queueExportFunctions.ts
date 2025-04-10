import { MusicUnit } from "./tracksQueue";
import tracksQueue, { TracksQueue } from 'components/player/tracksQueue';
import { API } from "utils/api";

export function queueSectionFill(page: HTMLElement) {
    const tracksQueue = Array.from(page.querySelectorAll('#track'));
    for (const track of tracksQueue) {
        track.addEventListener('click', async (e: Event) => {
            await addToQueueListener(e)
        });
    }
}

async function addToQueueListener(e: Event) {
    const track = e.currentTarget as HTMLElement;

    const trackId = track.getAttribute('data-id');
    const section = track.parentElement;
    const queue: MusicUnit[] = [];

    let idx = 0;
    let trackIdx = 0;
    for (const child of section.children) {
        const childId = child.getAttribute('data-id');
        
        const response = (await API.getTrack(Number(childId))).body;

        const src = response.file_url;
        const duration = response.duration;
        const name = response.title;
        const artist = response.artists[0].title;
        const img = response.thumbnail_url;

        queue.push({
            name: name,
            artist: artist,
            image: img,
            duration: duration,
            src: src
        });

        if (childId === trackId) {
            trackIdx = idx;
        }
        idx++;
    }

    tracksQueue.clearQueue();
    tracksQueue.addTrack(queue, trackIdx);
}

