class PlayerSync {
    private static readonly QUEUE_KEY = 'playerQueue';
    private static readonly HEARTBEAT_KEY = 'masterHeartbeat';
    private static readonly HEARTBEAT_INTERVAL = 500;
    private static readonly HEARTBEAT_TIMEOUT = 1500; 

    id: string;
    isMaster: boolean;
    callback: () => void;

    private heartbeatTimer?: number;
    private masterCheckTimer?: number;
    private destroyed: boolean = false;

    constructor(callback: () => void) {
        this.id = crypto.randomUUID();
        this.isMaster = false;
        this.callback = callback;

        this.enterQueue();
        this.updateMasterFlag();
        
        this.checkMasterHealth();

        window.addEventListener('storage', this.onStorageEvent);
        window.addEventListener('pagehide', this.onPageHide);
        window.addEventListener('beforeunload', this.onPageHide);

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

    destroy() {
        if (this.destroyed) return;
        this.destroyed = true;

        this.stopHeartbeat();
        
        if (this.masterCheckTimer !== undefined) {
            clearInterval(this.masterCheckTimer);
            this.masterCheckTimer = undefined;
        }

        window.removeEventListener('storage', this.onStorageEvent);
        window.removeEventListener('pagehide', this.onPageHide);
        window.removeEventListener('beforeunload', this.onPageHide);
    }

    private checkMasterHealth() {
        if (this.destroyed) return;

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
        if (!lastBeat || Date.now() - lastBeat > PlayerSync.HEARTBEAT_TIMEOUT) {
            console.warn(`Master ${masterId} is dead or never started—taking over`);
            this.removeMasterAndTakeover(masterId);
        }
    }

    private removeMasterAndTakeover(deadMasterId: string) {
        let queue = this.getQueue();
      
        queue = queue.filter(id => id !== deadMasterId);
        queue = queue.filter(id => id !== this.id);
   
        queue.unshift(this.id);
        this.setQueue(queue);
        this.updateMasterFlag();
    }

    private insertSelfAsMaster() {
        let queue = this.getQueue();
        queue = queue.filter(id => id !== this.id);

        queue.unshift(this.id);
        this.setQueue(queue);
        this.updateMasterFlag();
    }

    private onStorageEvent = (e: StorageEvent) => {
        if (this.destroyed) return;

        if (e.key === PlayerSync.QUEUE_KEY) {
            this.updateMasterFlag();
        }
    }

    private onPageHide = () => {
        if (this.isMaster) {
            try {
                localStorage.setItem('is-playing', 'false');
                localStorage.removeItem(PlayerSync.HEARTBEAT_KEY);
            } catch { /* ignore */ }
        }
        this.leaveQueue();
        this.destroy();
    }
}

export default PlayerSync;
  
