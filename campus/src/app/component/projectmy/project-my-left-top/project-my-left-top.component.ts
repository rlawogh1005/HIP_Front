import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from 'src/app/models/common/api-response.interface';
import { ProjectResponseData } from 'src/app/models/project/projects/projects-response.interface';
import { ProjectService } from 'src/app/services/project/project.service';
import { UploadProjectFileComponent } from '../../upload-project-file/upload-project-file.component';
import { ProjectKeyDocResponseData } from 'src/app/models/project/project_key_doc/project_key_doc-response.interface';

@Component({
  selector: 'app-project-my-left-top',
  templateUrl: './project-my-left-top.component.html',
  styleUrls: ['./project-my-left-top.component.scss'],
})
export class ProjectMyLeftTopComponent implements OnInit {
  projects?: ProjectResponseData;
  project_id: number = 0;
  project_key_doc?: ProjectKeyDocResponseData;
  allItems: Array<{ key_doc_category: string, key_doc_title: string, key_doc_id: number }> = [];

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
        this.loadAllProjectKeyDocs(this.project_id);
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

  async loadAllProjectKeyDocs(
    projectId: number,
  ): Promise<void> {
    try {
      const response = await firstValueFrom(this.projectService.getAllProjectKeyDoc(projectId));
      this.allItems = response.data; // 백엔드에서 받은 탭 정보
      console.log('탭 데이터:', this.allItems);
    } catch (error) {
      console.error('탭 로드 중 오류 발생:', error);
    }
  }

  async openUploadModal(
    key_doc_category: string
  ): Promise<void> {
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

  async loadKeyDocModal(
    projectId: number,
    key_doc_id: number
  ): Promise<any> {
    try{
      const response: ApiResponse<ProjectKeyDocResponseData> = await firstValueFrom(
        this.projectService.getOneProjectKeyDoc(projectId, key_doc_id)
      );
      this.project_key_doc = response.data;
      console.log('project_key_doc 데이터:', this.project_key_doc);
    } catch (error) {
      console.error('project_key_doc 로드 중 오류 발생:', error);
    }
  }

  async KeyDocClickButton(
    key_doc_category: string,
    projectId: number,
    key_doc_id: number
  ): Promise<any> {
    try {
      const loading = await this.loadingController.create({
        message: '프로젝트를 불러오는 중...',
      });
      await loading.present();

      const response: ApiResponse<ProjectResponseData> = await firstValueFrom(
        this.projectService.getOneProject(this.project_id)
      );

      if(!response.data.project_id) {
        this.openUploadModal(key_doc_category);
      } else if(response.data.project_id) {
        this.loadKeyDocModal(projectId, key_doc_id);
      }
      else {
        console.log('예상치 못한 오류입니다.');
      }
      await loading.dismiss();
    } catch (error) {
      console.error('프로젝트 로드 중 오류 발생:', error);
    }
  }

  async downloadKeyDoc(
    projectId: number, 
    key_doc_id: number
  ): Promise<any> {
    try {
      const response = await this.projectService.downloadProjectKeyDoc(projectId, key_doc_id).toPromise();
      
      // Blob 객체 생성
      const blob = new Blob([response], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      
      // 링크 생성 및 클릭하여 다운로드
      const a = document.createElement('a');
      a.href = url;
      a.download = `project_key_doc_${key_doc_id}.pdf`; // 파일 이름 지정
      document.body.appendChild(a);
      a.click();
      
      // 다운로드 후 링크 제거
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('파일 다운로드 중 오류 발생:', error);
    }
  }
}
