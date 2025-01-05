import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProjectmyPageRoutingModule } from './projectmy-routing.module';
import { SidemenuComponent } from "../../../component/sidemenucomponent/sidemenu.component";
import { ProjectmyPage } from './projectmy.page';
import { ProjectMyLeftTopComponent } from '../../../component/projectmy/project-my-left-top/project-my-left-top.component';
import { ProjectMyLeftBottomComponent } from '../../../component/projectmy/project-my-left-bottom/project-my-left-bottom.component';
import { ProjectMyRightComponent } from '../../../component/projectmy/project-my-right/project-my-right.component';
import { ProjectMyLeftBottomModule } from 'src/app/component/projectmy/project-my-left-bottom/project-my-left-bottom.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectmyPageRoutingModule,
    SidemenuComponent,
    ProjectMyLeftBottomModule
  ],
  declarations: [
    ProjectmyPage,
    ProjectMyLeftTopComponent,
    ProjectMyRightComponent
  ]
})
export class ProjectmyPageModule {}
