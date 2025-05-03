export function debounce(fn: Function, delay: number = 200) {
    let timer = -1;
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = window.setTimeout(fn, delay, ...args);
    }
}
