class PlayerSync {
    private static readonly QUEUE_KEY = 'playerQueue';
    private static readonly HEARTBEAT_KEY = 'masterHeartbeat';
    private static readonly HEARTBEAT_INTERVAL = 1000; 
    private static readonly HEARTBEAT_TIMEOUT = 2000; 

    id: string;
    isMaster: boolean;
    callback: () => void;
    heartbeatTimer?: number;
    masterCheckTimer?: number;

    constructor(callback: () => void) {
        this.id = crypto.randomUUID();
        this.isMaster = false;
        this.callback = callback;

        this.enterQueue();
        this.updateMasterFlag();

        window.addEventListener('storage', this.onStorageEvent.bind(this));

        this.masterCheckTimer = window.setInterval(() => this.checkMasterHealth(), 1000);
    }

    private getQueue(): string[] {
        const raw = localStorage.getItem(PlayerSync.QUEUE_KEY);
        try {
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    private setQueue(queue: string[]) {
        localStorage.setItem(PlayerSync.QUEUE_KEY, JSON.stringify(queue));
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
        const prevMaster = this.isMaster;
        this.isMaster = queue.length > 0 && queue[0] === this.id;

        if (this.isMaster && !prevMaster) {
            console.log(`Player ${this.id} is MASTER`);
            this.callback();
            this.startHeartbeat();
        } else if (!this.isMaster && prevMaster) {
            console.log(`Player ${this.id} is SLAVE`);
            this.stopHeartbeat();
        }
    }

    private startHeartbeat() {
        this.heartbeatTimer = window.setInterval(() => {
            localStorage.setItem(PlayerSync.HEARTBEAT_KEY, Date.now().toString());
        }, PlayerSync.HEARTBEAT_INTERVAL);
    }

    private stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = undefined;
        }
    }

    private checkMasterHealth() {
        const queue = this.getQueue();
        if (queue.length === 0) return;

        const masterId = queue[0];

        if (masterId === this.id) {
            return;
        }

        const heartbeatRaw = localStorage.getItem(PlayerSync.HEARTBEAT_KEY);
        const heartbeat = heartbeatRaw ? parseInt(heartbeatRaw) : 0;
        const now = Date.now();

        if (now - heartbeat > PlayerSync.HEARTBEAT_TIMEOUT) {
            console.warn(`Master is dead. Removed ${masterId} from queue.`);
            const newQueue = queue.filter(id => id !== masterId);
            this.setQueue(newQueue);

            this.updateMasterFlag();
        }
    }

    private onStorageEvent(e: StorageEvent) {
        if (e.key === PlayerSync.QUEUE_KEY) {
            this.updateMasterFlag();
        }
    }
}

export default PlayerSync;
