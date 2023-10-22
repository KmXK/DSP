import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { SignalComponent } from '@app/signal/signal.component';
import { PlotlyModule } from 'angular-plotly.js';
import * as Protly from 'plotly.js-dist-min';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
    CdkDrag,
    CdkDragHandle,
    CdkDragPlaceholder,
    CdkDragPreview,
    CdkDropList,
    CdkDropListGroup
} from '@angular/cdk/drag-drop';
import { SignalListComponent } from '@app/signal-list/signal-list.component';
import { SignalModal } from '@app/signal-modal/signal-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SignalActionListComponent } from './signal-action-list/signal-action-list.component';
import { MatMenuModule } from '@angular/material/menu';
import { CombinationActionComponent } from './signal-actions/combination-action/combination-action.component';
import { ModulationActionComponent } from './signal-actions/modulation-action/modulation-action.component';
import { SignalDropComponent } from './signal-drop/signal-drop.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import {
    FourierTransformActionComponent
} from '@app/signal-actions/fourier-transform-action/fourier-transform-action.component';

PlotlyModule.plotlyjs = Protly;

@NgModule({
    declarations: [
        AppComponent,
        SignalComponent,
        SignalListComponent,
        SignalModal,
        SignalActionListComponent,
        CombinationActionComponent,
        ModulationActionComponent,
        FourierTransformActionComponent,
        SignalDropComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        PlotlyModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        CdkDrag,
        CdkDragHandle,
        CdkDropList,
        MatDialogModule,
        FormsModule,
        MatMenuModule,
        MatCardModule,
        MatIconModule,
        CdkDropListGroup,
        CdkDragPlaceholder,
        CdkDragPreview,
        MatRadioModule,
        MatSliderModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
