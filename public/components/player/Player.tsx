import { Component } from "libs/rzf/Component";

import PlayerSmall from "./PlayerSmall";
import PlayerFullscreen from "./PlayerFullscreen";
import PlayerMobile from "./PlayerMobile";
import PlayerMobileFullscreen from "./PlayerMobileFullscreen";

import { PLAYER_STORAGE } from "utils/flux/storages";
import { marqueeHandler } from "common/marquee";
import './SongTitle/marquee.scss';

import DragProgressBar from "./DragHandlers/DragProgressBar";
import MobileDragProgressBar from "./DragHandlers/MobileDragProgressBar";
import { isMobileDevice } from "utils/isMobileDevice";

type DisplayType = 'small' | 'fullscreen' | 'none';
type size = 'mobile' | 'desktop';
type ProgressBarClass = typeof DragProgressBar | typeof MobileDragProgressBar;

const mobileBreakpoint = 1100;

export class Player extends Component {
    private unsubscribe: () => void;
    private url: string;
    private mediaQuery: MediaQueryList;

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

        const isMobile = isMobileDevice();
        this.mediaQuery = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`);
        const initialSize: size = this.mediaQuery.matches ? 'mobile' : 'desktop';
        
        this.state = {
            displayedOption: getDisplayType(),
            size: initialSize,
            ProgressBarClass: isMobile ? MobileDragProgressBar : DragProgressBar,
        }
        
        this.mediaQuery.addEventListener('change', this.handleMediaChange);

        PLAYER_STORAGE.subscribe(this.onPlayerUpdate);
        marqueeHandler();
    }

    handleMediaChange = (e: MediaQueryListEvent) => {
        const newSize: size = e.matches ? 'mobile' : 'desktop';
        this.setState({ 
            ...this.state,
            size: newSize
        });
    }

    onPlayerUpdate = () => {
        try {
            const currentTrack = JSON.parse(localStorage.getItem('current-track') || 'undefined');
            const shouldShow = !!currentTrack;
            const currentlyShown = this.state.displayedOption !== 'none';
            
            if (shouldShow && !currentlyShown) {
                this.setState({ ...this.state, displayedOption: 'small' });
            } else if (!shouldShow && currentlyShown) {
                this.setState({ ...this.state, displayedOption: 'none' });
            } else {
                this.setState({ ...this.state });
            }
        } catch (error) {
            console.error('Error checking player state:', error);
        }
    }

    componentWillUnmount() {
        if (this.mediaQuery) {
            this.mediaQuery.removeEventListener('change', this.handleMediaChange);
        }
        PLAYER_STORAGE.unsubscribe(this.onPlayerUpdate);
    }

    render() {
        if (this.url !== location.pathname) {
            if (this.state.displayedOption as DisplayType === 'fullscreen') {
                this.toggleDisplayedOption();
            }
            this.url = location.pathname;
        }

        switch (this.state.displayedOption as DisplayType) {
            case 'small':
                if (this.state.size === 'mobile') 
                    return [
                        <PlayerMobile 
                            onResize={this.toggleDisplayedOption}
                            ProgressBarClass={this.state.ProgressBarClass}
                        />
                    ];
                return [
                    <PlayerSmall
                        onResize={this.toggleDisplayedOption}
                        ProgressBarClass={this.state.ProgressBarClass}
                    />
                ];
                
            case 'fullscreen':
                if (this.state.size === 'mobile') 
                    return [
                        <PlayerMobileFullscreen 
                            onResize={this.toggleDisplayedOption}
                            ProgressBarClass={this.state.ProgressBarClass}
                        />
                    ];
                return [
                    <PlayerFullscreen 
                        onResize={this.toggleDisplayedOption}
                        ProgressBarClass={this.state.ProgressBarClass}
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
            size: this.mediaQuery.matches ? 'mobile' : 'desktop'
        });
    };
}

