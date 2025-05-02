import { Component } from "libs/rzf/Component";

import PlayerSmall from "./PlayerSmall";
import PlayerFullscreen from "./PlayerFullscreen";

type SizeType = 'small' | 'fullscreen';

export class Player extends Component {
    constructor(props: Record<string, any>) {
        super(props);
        this.state = {
            size: 'small' as SizeType
        }       
    }

    render() {
        switch (this.state.size) {
            case 'small':
                return [
                    <PlayerSmall
                        onResize={this.toggleSize} 
                    />
                ];
            case 'fullscreen':
                return [
                    <PlayerFullscreen 
                        onResize={this.toggleSize} 
                    />
                ];
        }
    }

    
    toggleSize = () => {
        this.setState({
            size: this.state.size as SizeType === 'small' ? 'fullscreen' : 'small'
        });
    };
}

