import { Component } from "libs/rzf/Component";

import PlayerSmall from "./PlayerSmall";
import PlayerFullscreen from "./PlayerFullscreen";
import player from "common/player";

type DisplayType = 'small' | 'fullscreen' | 'none';

export class Player extends Component {
    private unsubscribe: () => void;

    constructor(props: Record<string, any>) {
        super(props);
        const getDisplayType = () => {
            let display: DisplayType;
            try {
                const currentTrack = JSON.parse(localStorage.getItem('current-track') || 'undefined');
                display = currentTrack ? 'small' : 'none';
            } catch (error) {
                display ='none';
            }

            return display;
        };

        this.state = {
            displayedOption: getDisplayType()
        }

        this.configureNoneDisplay();
    }

    configureNoneDisplay() {
        if (this.state.displayedOption === 'none') {
            this.unsubscribe = player.subscribe(() => {
                this.toggleDisplayedOption();
                this.unsubscribe();
            });
        }
    }

    render() {
        switch (this.state.displayedOption as DisplayType) {
            case 'small':
                return [
                    <PlayerSmall
                        onResize={this.toggleDisplayedOption} 
                    />
                ];
            case 'fullscreen':
                return [
                    <PlayerFullscreen 
                        onResize={this.toggleDisplayedOption} 
                    />
                ];
            case 'none':
                return [];
        }
    }

    
    toggleDisplayedOption = () => {
        this.setState({
            displayedOption: (this.state.displayedOption === 'fullscreen' || this.state.displayedOption === 'none') 
                ? 'small' 
                : 'fullscreen',
        });
    };
}

