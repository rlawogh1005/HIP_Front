import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClassmyPageRoutingModule } from './classmy-routing.module';

import { ClassmyPage } from './classmy.page';
import {SidemenuComponent} from "../../../component/sidemenucomponent/sidemenu.component";
import {CourseTitleComponent} from "../../../component/course-title/course-title.component";
import {DocTopicComponent} from "../../../component/doc-topic/doc-topic.component";
import { VideoCreateModalComponent } from 'src/app/component/video-create-modal/video-create-modal.component';
import { DocTopicModule } from 'src/app/component/doc-topic/doc-topic.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClassmyPageRoutingModule,
    SidemenuComponent,
    DocTopicModule
  ],
    declarations: [ClassmyPage, CourseTitleComponent, VideoCreateModalComponent]
})
export class ClassmyPageModule {}