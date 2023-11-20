import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Signal } from '@app/models/signal';
import { StaticSignal } from '@app/models/static.signal';

@Component({
    selector: 'app-audio-picker',
    templateUrl: './audio-picker.component.html',
    styleUrls: ['./audio-picker.component.scss']
})
export class AudioPickerComponent {
    @ViewChild('audioInput') audioInput!: ElementRef;

    @Output() audioChanged = new EventEmitter<Signal>;

    handleAudioClick(event: MouseEvent) {
        this.audioInput.nativeElement.click();
    }

    handleImageUpload(event: any) {
        const input = event.target as HTMLInputElement;

        if (input.files && input.files[0]) {
            const reader = new FileReader();

            reader.onload = (e: any) => {
                fetch(e.target.result)
                    .then(x => x.arrayBuffer())
                    .then(data => {
                        const context = new (window.AudioContext || (window as any).webkitAudioContext)();

                        context.decodeAudioData(data, buffer => {
                            const channelData = buffer.getChannelData(0);
                            const byteArray = new Float32Array(channelData.buffer);
                            console.log(byteArray);
                            this.audioChanged.emit(new StaticSignal([...byteArray]));
                            // Use byteArray for drawing
                        });
                    })
            };

            reader.readAsDataURL(input.files[0]);
        }
    }
}
