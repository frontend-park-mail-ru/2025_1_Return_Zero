class PlayerSync {
    private static readonly QUEUE_KEY = 'playerQueue';

    id: string;
    isMaster: boolean;
    callback: () => void;

    constructor(callback: () => void) {
        this.id = crypto.randomUUID();
        this.isMaster = false;
        this.callback = callback;

        this.enterQueue();
        this.updateMasterFlag();

        window.addEventListener('storage', this.onStorageEvent.bind(this));
        window.addEventListener('beforeunload', this.onBeforeUnload.bind(this));
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
        this.isMaster = queue.length > 0 && queue[0] === this.id;
        console.log(`Player ${this.id} is ${this.isMaster ? 'MASTER' : 'SLAVE'}`);

        if (this.isMaster) {
            this.callback();
        }
    }

    private onBeforeUnload() {
        this.leaveQueue();
    }

    private onStorageEvent(e: StorageEvent) {
        if (e.key === PlayerSync.QUEUE_KEY) {
            this.updateMasterFlag();
        }
    }
}

export default PlayerSync;
  