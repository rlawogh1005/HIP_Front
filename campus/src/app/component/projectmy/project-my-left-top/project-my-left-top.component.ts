import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from 'src/app/models/common/api-response.interface';
import { ProjectResponseData } from 'src/app/models/project/projects/projects-response.interface';
import { ProjectService } from 'src/app/services/project/project.service';

@Component({
  selector: 'app-project-my-left-top',
  templateUrl: './project-my-left-top.component.html',
  styleUrls: ['./project-my-left-top.component.scss'],
})
export class ProjectMyLeftTopComponent  implements OnInit {
  projects?: ProjectResponseData;
  project_id: number = 0;
  constructor(
    private projectService: ProjectService,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private route: ActivatedRoute
  ) { }

  refreshPage() {
    window.location.reload();
  }
  
  ngOnInit(): void {
    // Route에서 project_id를 가져오고 이후 loadProject 호출
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
      // 로딩 컨트롤러 표시
      const loading = await this.loadingController.create({
        message: '프로젝트를 불러오는 중...',
      });
      await loading.present();

      // API 호출 및 데이터 설정
      const response: ApiResponse<ProjectResponseData> = await firstValueFrom(
        this.projectService.getOneProject(this.project_id)
      );
      this.projects = response.data;
      console.log('프로젝트 데이터:', this.projects);

      // 로딩 컨트롤러 해제
      await loading.dismiss();
    } catch (error) {
      console.error('프로젝트 로드 중 오류 발생:', error);
    }
  }
}