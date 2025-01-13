import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from 'src/app/models/common/api-response.interface';
import { ProjectResponseData } from 'src/app/models/project/projects/projects-response.interface';
import { ProjectService } from 'src/app/services/project/project.service';
import { UploadProjectFileComponent } from '../../upload-project-file/upload-project-file.component';

@Component({
  selector: 'app-project-my-left-top',
  templateUrl: './project-my-left-top.component.html',
  styleUrls: ['./project-my-left-top.component.scss'],
})
export class ProjectMyLeftTopComponent implements OnInit {
  projects?: ProjectResponseData;
  project_id: number = 0;

  constructor(
    private projectService: ProjectService,
    private modalController: ModalController, // ModalController 주입
    private loadingController: LoadingController,
    private route: ActivatedRoute
  ) {}

  refreshPage() {
    window.location.reload();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.project_id = Number(params['project_id']);
      console.log('URL project_id:', this.project_id);
      if (!isNaN(this.project_id) && this.project_id > 0) {
        this.loadProject(); // project_id가 유효하면 loadProject 실행
      } else {
        console.error('Invalid project_id:', this.project_id);
      }
    });
  }

  async loadProject(): Promise<void> {
    try {
      const loading = await this.loadingController.create({
        message: '프로젝트를 불러오는 중...',
      });
      await loading.present();

      const response: ApiResponse<ProjectResponseData> = await firstValueFrom(
        this.projectService.getOneProject(this.project_id)
      );
      this.projects = response.data;
      console.log('프로젝트 데이터:', this.projects);

      await loading.dismiss();
    } catch (error) {
      console.error('프로젝트 로드 중 오류 발생:', error);
    }
  }

  async openUploadModal(key_doc_category: string): Promise<void> {
    console.log('project-my-left-top-component key_doc category: ', key_doc_category);
    const modal = await this.modalController.create({
      component: UploadProjectFileComponent, // 모달로 띄울 컴포넌트
      componentProps: {
        projectId: this.project_id, // 프로젝트 ID를 props로 전달
        projectKeyDocCategory: key_doc_category
      }
    });
    return await modal.present();
  }
}
