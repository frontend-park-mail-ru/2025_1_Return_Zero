import tracksQueue, { TracksQueue } from 'components/player/tracksQueue';
import { F } from 'libs/handlebars-v4.7.8';
import Router from 'libs/Router';
import { API } from 'utils/api';

export async function addToQueueListener(track: HTMLElement) {
    const trackId = track.getAttribute('data-track-id');
    const section = track.closest('section');
    const queue: string[] = [];

    const type = section.getAttribute('data-request');
    const tracks: any = await getTracks(type, track);
    // console.warn(tracks);

    let idx = 0;
    let flag = false;
    let trackIdx = 0;
    for (const track of tracks) {
        queue.push(track.id);

        if (track.id == trackId && !flag) {
            trackIdx = idx;
            flag = true;
        }
        idx++;
    }

    tracksQueue.clearQueue();
    tracksQueue.addTrack(queue, trackIdx);
}

function getPathArgs(cntArgs: number) {
    const path = Router.getPath();
    const splitted = Array.from(path.split('/'));
    const result = [];
    for (let i = splitted.length - cntArgs; i < splitted.length; ++i) {
        result.push(splitted[i]);
    }

    return result;
}

async function getTracks(type: string, track: HTMLElement) {
    let tracks: any = [];
    switch (type) {
        case 'popular-tracks':
            const args = getPathArgs(2);
            const id = Number(args[0]);
            tracks = Array.from((await API.getArtistTracks(id, 100)).body);
            break;
        case 'recommendations':
            tracks = Array.from((await API.getTracks(100)).body);
            break;
        case 'loved':
            tracks = Array.from((await API.getTracks(100)).body);
            break;
        case 'recent':
            const section = track.closest('section');
            tracks = Array.from(section.querySelectorAll('[data-type="track"]'));
            for (let i = 0; i < tracks.length; ++i) {
                tracks[i] = { id:  tracks[i].getAttribute('data-track-id') };
            }
            break;
        case 'artist':
            const artistId = Number(getPathArgs(1)[0]);
            tracks = Array.from((await API.getArtistTracks(artistId, 100)).body);
            break;
        default:
            tracks = await getTracks(getPathArgs(1)[0], track);
            break; 
    }

    return tracks;
}
