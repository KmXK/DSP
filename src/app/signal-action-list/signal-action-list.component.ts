import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-signal-action-list',
    templateUrl: './signal-action-list.component.html',
    styleUrls: ['./signal-action-list.component.scss'],
    animations: [
        trigger('removing', [
            state('removed', style({
                left: -2000,
                color: 'red'
            })),
            transition('* => removed', [
                animate(300)
            ])
        ])
    ]
})
export class SignalActionListComponent {
    actionTypes = ['Combination', 'Modulation', 'Fourier', 'Smoothing', 'Kernel', 'Correlation', 'Auto Correlation', 'Audio Converter', 'Image Correlation'];
    actions: [string, number][] = [['Correlation', 0]];
    states: string[] = [];

    private nextActionId = 1;

    addAction(type: string) {
        this.actions = [[type, this.nextActionId++], ...this.actions];
        this.states = ['', ...this.states];
    }

    removeItem(index: number) {
        this.states[index] = 'removed';

        setTimeout(() => {
            this.actions = this.actions.filter((_, i) => i !== index);
            this.states = this.states.filter((_, i) => i !== index);
        }, 500);
    }

    actionTypeTrackFunction(index: number, item: [string, number]) {
        return item[1];
    }
}
