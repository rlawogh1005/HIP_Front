import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectMyLeftBottomComponent } from './project-my-left-bottom.component';
import { DocTopicModule } from '../../doc-topic/doc-topic.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
      ProjectMyLeftBottomComponent
    ],
    imports: [
        CommonModule,
        DocTopicModule,
        IonicModule,
        FormsModule
    ],
    exports: [ProjectMyLeftBottomComponent]
  })
  export class ProjectMyLeftBottomModule {}
  