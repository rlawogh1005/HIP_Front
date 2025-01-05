// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { ProjectMyLeftBottomComponent } from './project-my-left-bottom.component';
// import { DocTopicComponent } from '../../doc-topic/doc-topic.component';

// const routes: Routes = [
//     {
//         path: '',
//         component: ProjectMyLeftBottomComponent,
//         children: [
//             {
//                 path: 'project-title/:topicId',
//                 component: DocTopicComponent
//             },
//             {
//                 path: 'project-title',
//                 component: DocTopicComponent
//             },
//             {
//                 path: '',
//                 redirectTo: 'project-title',
//                 pathMatch: 'full'
//             }
//         ]
//     }
// ];

// @NgModule({
//     imports: [RouterModule.forChild(routes)],
//     exports: [RouterModule]
// })
// export class ProjectMyLeftBottomRoutingModule {}