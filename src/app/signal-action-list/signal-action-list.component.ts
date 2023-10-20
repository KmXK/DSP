import { Component } from '@angular/core';

@Component({
    selector: 'app-signal-action-list',
    templateUrl: './signal-action-list.component.html',
    styleUrls: ['./signal-action-list.component.scss']
})
export class SignalActionListComponent {
    actionTypes = ['Combination', 'Modulation'];

    actions: string[] = ['Combination', 'Modulation'];

    addAction(type: string) {
        this.actions = [type, ...this.actions];
    }

    removeItem(index: number) {
        this.actions.splice(index, 1);
    }
}
