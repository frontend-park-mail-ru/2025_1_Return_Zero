import { Component } from "libs/rzf/Component";

import PlayerSmall from "./PlayerSmall";

import tracksQueue from "common/tracksQueue";

export class Player extends Component {
    constructor(props: Record<string, any>) {
        super(props);
        this.state = {
            size: 'small'
        }       
    }

    render() {
        switch (this.state.size) {
            case 'small':
                return [
                    <PlayerSmall />
                ];
            case 'fullscreen':
                return [
                    <div className="fullscreen-player">Плеер в полном режиме</div>,
                ];
        }
    }

    
    toggleSize = () => {
        this.setState({
            size: this.state.size === 'small' ? 'big' : 'small'
        });
    };
}

