import { Component } from "libs/rzf/Component";

import PlayerSmall from "./PlayerSmall";
import PlayerFullscreen from "./PlayerFullscreen";
import PlayerMobile from "./PlayerMobile";
import PlayerMobileFullscreen from "./PlayerMobileFullscreen";

import player from "common/player";

type DisplayType = 'small' | 'fullscreen' | 'none';
type size = 'mobile' | 'desktop';

const mobileBreakpoint = 1100;

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
            displayedOption: getDisplayType(),
            size: window.innerWidth <= mobileBreakpoint ? 'mobile' : 'desktop',
        }
        
        const mediaQuery = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`);
        mediaQuery.addEventListener('change', this.handleMediaChange.bind(this));


        this.configureNoneDisplay();
    }

    handleMediaChange(e: any) {
        if (e.matches) {
            this.setState({ size: 'mobile', displayedOption: this.state.displayedOption });
        } else {
            this.setState({ size: 'desktop', displayedOption: this.state.displayedOption });
        }
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
                if (this.state.size === 'mobile') 
                    return [
                        <PlayerMobile 
                            onResize={this.toggleDisplayedOption}
                        />
                    ];
                return [
                    <PlayerSmall
                        onResize={this.toggleDisplayedOption} 
                    />
                ];

            case 'fullscreen':
                if (this.state.size === 'mobile') 
                    return [
                        <PlayerMobileFullscreen 
                            onResize={this.toggleDisplayedOption} 
                        />
                    ];
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
            size: window.innerWidth <= mobileBreakpoint ? 'mobile' : 'desktop'
        });
    };
}

