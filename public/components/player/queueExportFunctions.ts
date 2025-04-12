import tracksQueue, { TracksQueue } from 'components/player/tracksQueue';

export async function addToQueueListener(track: HTMLElement) {
    const trackId = track.getAttribute('data-track-id');
    const section = track.closest('.section');
    const queue: string[] = [];

    const tracks = Array.from(section.querySelectorAll('[data-type="track"]'));

    let idx = 0;
    let trackIdx = 0;
    for (const child of tracks) {
        const childId = child.getAttribute('data-track-id');
        queue.push(childId);

        if (childId === trackId) {
            trackIdx = idx;
        }
        idx++;
    }

    tracksQueue.clearQueue();
    tracksQueue.addTrack(queue, trackIdx);
}

