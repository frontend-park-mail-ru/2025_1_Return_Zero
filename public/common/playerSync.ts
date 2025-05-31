class PlayerSync {
    private static readonly QUEUE_KEY = 'playerQueue';
    private static readonly HEARTBEAT_KEY = 'masterHeartbeat';
    private static readonly HEARTBEAT_INTERVAL = 1000;
    private static readonly HEARTBEAT_TIMEOUT = 1500;

    id: string;
    isMaster: boolean;
    callback: () => void;

    private heartbeatTimer?: number;
    private masterCheckTimer: number;

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
        const wasMaster = this.isMaster;
        this.isMaster = queue.length > 0 && queue[0] === this.id;

        if (this.isMaster && !wasMaster) {
            console.log(`Player ${this.id} is now MASTER`);
            this.callback();
            this.startHeartbeat();
        } else if (!this.isMaster && wasMaster) {
            console.log(`Player ${this.id} is now SLAVE`);
            this.stopHeartbeat();
        }
    }

    private startHeartbeat() {
        localStorage.setItem(PlayerSync.HEARTBEAT_KEY, Date.now().toString());
        this.heartbeatTimer = window.setInterval(() => {
        localStorage.setItem(PlayerSync.HEARTBEAT_KEY, Date.now().toString());
        }, PlayerSync.HEARTBEAT_INTERVAL);
    }

    private stopHeartbeat() {
        if (this.heartbeatTimer !== undefined) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = undefined;
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
        let queue = this.getQueue().filter(id => id !== this.id);
        queue = queue.filter((_, idx) => idx !== 0);
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
        try {
            localStorage.setItem('is-playing', 'false');
        } catch { /* ignore */ }
        }
        this.leaveQueue();
    }
}

export default PlayerSync;
  
