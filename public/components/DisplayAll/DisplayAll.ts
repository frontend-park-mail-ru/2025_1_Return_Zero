import { Component } from "libs/Component";
import { State } from "libs/State";

export type RetrieveFunction = (limit: number, offset: number) => Promise<any>;

export class DisplayAll extends Component {
    protected static template: any;

    protected offset: number;
    protected limit: number;
    protected uploadCount: number;

    protected retrieveFunction: State<RetrieveFunction>;
    protected items: State<any[]>;

    protected waiting: boolean;
    protected waitigTime: number;
    
    protected init() {
        this.element.addEventListener('wheel', this.onScroll.bind(this));
        this.element.style.position = 'relative';
        this.element.style.overflowY = 'scroll';
        this.element.style.display = 'flex';
        this.element.style.flexDirection = 'column';

        this.offset = 0;
        this.limit = 50;
        this.uploadCount = 20;

        this.waiting = false;
        this.waitigTime = 500;

        this.items = this.createState([]);

        this.retrieveFunction = this.createState(null);
        this.createCallback(this.retrieveFunction, 
            () => this.retrieveFunction.getState()(this.uploadCount, this.offset).then((res: any[]) => {
                this.items.setState(res);
                this.build();
            })
        );
    }

    protected build() {
        this.element.innerHTML = '';
        this.items.getState().forEach((item, index) => {
            this.element.insertAdjacentHTML('beforeend', 
                (this.constructor as typeof DisplayAll).template({
                    ...item,
                    index: this.offset + index + 1
                })
            );
        })
    }

    protected async onScroll(e: WheelEvent) {
        if (this.waiting) return;
        this.waiting = true;
        
        const scrollTop = this.element.scrollTop;
        const scrollHeight = this.element.scrollHeight;
        const clientHeight = this.element.clientHeight;

        if (e.deltaY > 0 && scrollTop >= (scrollHeight - clientHeight) * 0.9) {
            this.scrollDown(e)
        } else if (e.deltaY < 0 && scrollTop <= (scrollHeight - clientHeight) * 0.1) {
            this.scrollUp(e)
        }

        setTimeout(
            () => { this.waiting = false },
            this.waitigTime
        )
    }

    protected async scrollDown(e: WheelEvent) {
        const received_items = await this.retrieveFunction.getState()(
            this.uploadCount, this.offset + this.items.getState().length
        )
        const new_items = [...this.items.getState(), ...received_items]
        this.items.setState(new_items.slice(-this.limit));
        
        const removed_count = Math.max(0, new_items.length - this.limit);
        this.offset += removed_count;

        for (let i = 0; i < removed_count; i++)
            this.element.firstElementChild.remove();
        received_items.forEach((item: any, index: number) => {
            this.element.insertAdjacentHTML('beforeend', 
                (this.constructor as typeof DisplayAll).template({
                    ...item,
                    index: this.offset - removed_count + this.items.getState().length + index + 1
                })
            );
        })
    }

    protected async scrollUp(e: WheelEvent) {
        if (this.offset === 0) return;

        const received_items = await this.retrieveFunction.getState()(
            Math.min(this.uploadCount, this.offset), Math.max(0, this.offset - this.uploadCount)
        )
        const new_items = [...received_items, ...this.items.getState()]
        this.items.setState(new_items.slice(0, this.limit));

        const removed_count = Math.max(0, new_items.length - this.limit);
        this.offset -= received_items.length;
        
        const el = (this.element.firstElementChild as HTMLElement)
        const initialOffset = el.offsetTop;

        for (let i = 0; i < removed_count; i++)
            this.element.lastElementChild.remove();
        received_items.reverse().forEach((item: any, index: number) => {
            this.element.insertAdjacentHTML('afterbegin', 
                (this.constructor as typeof DisplayAll).template({
                    ...item,
                    index: this.offset + received_items.length - index
                })
            );
        })
        
        this.element.scrollTop += el.offsetTop - initialOffset;
    }
}