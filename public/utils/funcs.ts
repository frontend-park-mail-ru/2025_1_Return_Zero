export function debounce<T extends (...args: any) => any>(fn: T, delay: number = 200) {
    let timer = -1;
    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = window.setTimeout(fn, delay, ...args);
    }
}

export function one_alive_async<T extends (...args: any) => any>(fn: T, ret: any=null) {
    let isAlive = false;
    return async (...args: Parameters<T>) => {
        if (isAlive) return ret;
        isAlive = true;
        try {
            return await fn(...args);
        } catch(e) {
            throw e
        } finally {
            isAlive = false
        }
    }
}
