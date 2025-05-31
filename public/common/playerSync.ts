// PlayerSync.ts
class PlayerSync {
    private static readonly QUEUE_KEY = 'playerQueue';
    private static readonly HEARTBEAT_KEY = 'masterHeartbeat';
    private static readonly HEARTBEAT_INTERVAL = 500;   // миллисекунд
    private static readonly HEARTBEAT_TIMEOUT = 800;    // миллисекунд

    public id: string;
    public isMaster: boolean;
    private callback: () => void;

    private heartbeatTimer: number | undefined;
    private masterCheckTimer: number | undefined;

    constructor(callback: () => void) {
        this.id = crypto.randomUUID();
        this.isMaster = false;
        this.callback = callback;

        this.enterQueue();
        this.updateMasterFlag();

        window.addEventListener('storage', this.onStorageEvent.bind(this));
        window.addEventListener('pagehide', this.onPageHide.bind(this));

        this.masterCheckTimer = window.setInterval(
            () => this.checkMasterHealth(),
            PlayerSync.HEARTBEAT_INTERVAL
        );
    }

    public destroy() {
        if (this.isMaster) {
        this.stopHeartbeat();
        try {
            localStorage.removeItem(PlayerSync.HEARTBEAT_KEY);
        } catch {
            /* игнорируем */
        }
        }

        this.leaveQueue();
        this.cleanupAll();
    }


    private getQueue(): string[] {
        const raw = localStorage.getItem(PlayerSync.QUEUE_KEY);
        if (!raw) return [];
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.every(id => typeof id === 'string')) {
                return parsed;
            }

            localStorage.removeItem(PlayerSync.QUEUE_KEY);
            return [];
        } catch {
            localStorage.removeItem(PlayerSync.QUEUE_KEY);
            return [];
        }
    }


    private setQueue(queue: string[]) {
        try {
            localStorage.setItem(PlayerSync.QUEUE_KEY, JSON.stringify(queue));
        } catch {
        // В редком случае quota exceeded или запрещён, но тихо игнорируем
        }
    }

    private enterQueue() {
        const queue = this.getQueue();
        if (!queue.includes(this.id)) {
        queue.push(this.id);
        this.setQueue(queue);
        }
    }

    private leaveQueue() {
        const queue = this.getQueue().filter(x => x !== this.id);
        this.setQueue(queue);
    }

    private updateMasterFlag() {
        const queue = this.getQueue();
        const wasMaster = this.isMaster;
        this.isMaster = queue.length > 0 && queue[0] === this.id;

        if (this.isMaster && !wasMaster) {
            console.log(`Player ${this.id} is now MASTER`);
            this.callback();
            this.startHeartbeat();
        } else if (!this.isMaster && wasMaster) {
            console.log(`Player ${this.id} is now SLAVE`);
            this.stopHeartbeat();
            try {
                localStorage.removeItem(PlayerSync.HEARTBEAT_KEY);
            } catch {
                /* игнорируем */
            }
        }
    }

    private startHeartbeat() {
        try {
            localStorage.setItem(PlayerSync.HEARTBEAT_KEY, Date.now().toString());
        } catch {
        /* игнорируем */
        }
        this.heartbeatTimer = window.setInterval(() => {
        try {
            localStorage.setItem(PlayerSync.HEARTBEAT_KEY, Date.now().toString());
        } catch {
            /* игнорируем */
        }
        }, PlayerSync.HEARTBEAT_INTERVAL);
    }

    private stopHeartbeat() {
        if (this.heartbeatTimer !== undefined) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = undefined;
        }
    }

    private stopMasterCheck() {
        if (this.masterCheckTimer !== undefined) {
            clearInterval(this.masterCheckTimer);
            this.masterCheckTimer = undefined;
        }
    }

    private checkMasterHealth() {
        const queue = this.getQueue();
        if (queue.length === 0) {
            this.insertSelfAsMaster();
            return;
        }

        const masterId = queue[0];
            if (masterId === this.id) {
            return;
        }

        const hb = localStorage.getItem(PlayerSync.HEARTBEAT_KEY);
        const lastBeat = hb ? parseInt(hb, 10) : 0;
        if (Date.now() - lastBeat > PlayerSync.HEARTBEAT_TIMEOUT) {
            console.warn(`Master ${masterId} is dead—taking over`);
            this.insertSelfAsMaster();
        }
    }

    private insertSelfAsMaster() {
        let queue = this.getQueue();
        queue = queue.filter(id => id !== this.id);
        if (queue.length > 0) {
            queue.shift();
        }
   
        queue.unshift(this.id);

        this.setQueue(queue);
        this.updateMasterFlag();
    }

    private onStorageEvent(e: StorageEvent) {
        if (e.key === PlayerSync.QUEUE_KEY) {
            this.updateMasterFlag();
        }
    }

    private onPageHide() {
        if (this.isMaster) {
        this.stopHeartbeat();
        try {
            localStorage.removeItem(PlayerSync.HEARTBEAT_KEY);
        } catch {
            /* игнорируем */
        }
        }
        this.leaveQueue();
        this.cleanupAll();
    }

    private cleanupAll() {
        this.stopHeartbeat();
        this.stopMasterCheck();
        window.removeEventListener('storage', this.onStorageEvent.bind(this));
        window.removeEventListener('pagehide', this.onPageHide.bind(this));
    }
}

export default PlayerSync;

  
