import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectmyPage } from './projectmy.page';


const routes: Routes = [
  {
    path: '', //:project_id
    component: ProjectmyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectmyPageRoutingModule {}
