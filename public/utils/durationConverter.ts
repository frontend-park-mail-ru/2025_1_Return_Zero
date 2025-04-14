export function convertDuration(duration: number): string {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function parseDuration(durationString: string): number {
    const parts = durationString.split(':');

    if (parts.length !== 2) {
        throw new Error("Invalid duration format. Expected 'minutes:seconds'");
    }

    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);

    if (
        isNaN(minutes) ||
        isNaN(seconds) ||
        minutes < 0 ||
        seconds < 0 ||
        seconds >= 60
    ) {
        throw new Error(
            'Invalid time values. Minutes must be ≥ 0, seconds 0-59'
        );
    }

    return minutes * 60 + seconds;
}
