import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonLoadingDirective } from './directives/mat-button-loading.directive';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
    declarations: [MatButtonLoadingDirective],
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatSlideToggleModule,
        MatProgressSpinnerModule
    ],
    exports: [
        MatButtonLoadingDirective
    ]
})
export class SharedModule { }
