import { Component, Input } from '@angular/core';
import { Signal } from '@app/models/signal';

@Component({
    selector: 'app-signal-list',
    templateUrl: './signal-list.component.html',
    styleUrls: ['./signal-list.component.scss']
})
export class SignalListComponent {
    @Input() signals: Signal[] = [];

    noEnter(): boolean {
        console.log('enter predicate');
        return false;
    }

    test(el: any) {
        console.log(el);
    }

    noDrop(): void {

    }
}
