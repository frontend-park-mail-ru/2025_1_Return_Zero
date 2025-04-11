import { MusicUnit } from "./tracksQueue";
import tracksQueue, { TracksQueue } from 'components/player/tracksQueue';
import { API } from "utils/api";

export async function addToQueueListener(track: HTMLElement) {
    const trackId = track.getAttribute('data-id');
    const section = track.closest('.section');
    const queue: MusicUnit[] = [];

    const tracks = Array.from(section.querySelectorAll('#track'));

    let idx = 0;
    let trackIdx = 0;
    for (const child of tracks) {
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

