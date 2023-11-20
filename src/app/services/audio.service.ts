import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AudioService {
    private readonly audioContext: AudioContext;

    constructor() {
        this.audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();

        if (!this.audioContext) {
            throw new Error('Web Audio API is not supported');
        }
    }
}
