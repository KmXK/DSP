import { Component } from '@angular/core';

import { Signal } from '@app/models/signal';
import { SinusoidalSignal } from '@app/models/sinusoidal.signal';
import { RectangleSignal } from '@app/models/rectangle.signal';
import { TriangleSignal } from '@app/models/triangle.signal';
import { ChainsawSignal } from '@app/models/chainsaw.signal';
import { NoiseSignal } from '@app/models/noise.signal';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    signals: Signal[] = [
        new SinusoidalSignal(),
        new RectangleSignal(),
        new TriangleSignal(),
        new ChainsawSignal(),
        new NoiseSignal(),
    ];
}
