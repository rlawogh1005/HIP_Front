import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectListPage } from './project-list.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectListPage
  },
  {
    path: ':project_id',
    loadChildren: () => import('../projectmy/projectmy.module').then(m => m.ProjectmyPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectListPageRoutingModule {}
