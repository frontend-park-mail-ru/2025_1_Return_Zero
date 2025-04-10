import { MusicUnit } from "./tracksQueue";
import tracksQueue, { TracksQueue } from 'components/player/tracksQueue';

//test
const tracks = [
    {
        src: '/static/audio/audio.mp3',
        name: 'Miside main OST',
        artist: 'aihasto',
        image: '/static/img/251912_7_sq.jpg',
        duration: 190
    },
    {
        src: '/static/audio/audio2.mp3',  
        name: 'The Real Slim Shady',
        artist: 'eminem',
        image: '/static/img/eminem.jpg',
        duration: 285
    },
    {
        src: '/static/audio/audio3.mp3',
        name: 'Numb',
        artist: 'Linkin Park',
        image: '/static/img/linkin-park.jpg',
        duration: 186

    },
    {
        src: '/static/audio/audio4.mp3',
        name: 'Somebody That I Used To Know',
        artist: 'Gotye',
        image: '/static/img/gotye.jpg',
        duration: 245
    }
];

export function queueSectionFill(page: HTMLElement) {
    const tracksQueue = Array.from(page.querySelectorAll('#track'));
    for (const track of tracksQueue) {
        track.addEventListener('click', (e: Event) => {
            addToQueueListener(e)
        });
    }
}

function addToQueueListener(e: Event) {
    const track = e.currentTarget as HTMLElement;

    const trackId = track.getAttribute('data-id');
    const section = track.parentElement;
    const queue: MusicUnit[] = [];

    let idx = 0;
    let trackIdx = 0;
    for (const child of section.children) {
        //test
        const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];

        const childId = child.getAttribute('data-id');

        const name = child.querySelector('.track__title').textContent;
        const artist = child.querySelector('.track__artist').textContent;
        const img = child.querySelector('.track__img').getAttribute('src');

        queue.push({
            name: name,
            artist: artist,
            image: img,
            //test
            duration: randomTrack.duration,
            src: randomTrack.src
        });

        if (childId === trackId) {
            trackIdx = idx;
        }
        idx++;
    }

    tracksQueue.clearQueue();
    tracksQueue.addTrack(queue, trackIdx);
}

