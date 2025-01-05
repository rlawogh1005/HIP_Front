import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocTopicComponent } from './doc-topic.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [DocTopicComponent],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule
    ],
    exports: [DocTopicComponent]
})
export class DocTopicModule { }