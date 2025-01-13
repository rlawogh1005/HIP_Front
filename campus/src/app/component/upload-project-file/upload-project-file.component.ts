import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { VideoService } from 'src/app/services/course/video.service';
import { ProjectService } from 'src/app/services/project/project.service';

interface ProjectKeyDoc {
  key_doc_url: File;
  key_doc_title: string;
  key_doc_category: string;
}

@Component({
  selector: 'app-upload-project-file',
  templateUrl: './upload-project-file.component.html',
  styleUrls: ['./upload-project-file.component.scss'],
})
export class UploadProjectFileComponent implements OnInit {

  projectKeyDoc: ProjectKeyDoc | null = null;
  projectId: number = 0;
  projectKeyDocTitle: string = '';
  @Input() projectKeyDocCategory: string = ''; // @Input을 사용하여 props를 받음
  
  constructor(
    private modalController: ModalController,
    private projectService: ProjectService,
    private alertController: AlertController
  ) {}

  refreshPage() {
    window.location.reload();
  }

  // Alert 표시 메서드
  async showAlert(header: string, message: string, shouldRefresh: boolean = false) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: '확인',
          handler: () => {
            if (shouldRefresh) {
              this.modalController.dismiss(true);
              this.refreshPage();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  ngOnInit() {
    // 모달이 열릴 때 전달받은 데이터 처리
    const currentProject = localStorage.getItem('currentProject');
    if (currentProject) {
      this.projectId = JSON.parse(currentProject).project_id;
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const selectedFile = input.files[0];
      this.projectKeyDoc = {
        key_doc_url: selectedFile,
        key_doc_title: this.projectKeyDocTitle,
        key_doc_category: this.projectKeyDocCategory
      };

      console.log('Selected file:', selectedFile);
      console.log('upload-project-file-component-prodoccate: ', this.projectKeyDocCategory);
    }
  }

  async onUpload() {
    console.log('upload-project-file-component-prodoccate: ', this.projectKeyDocCategory);
    if (!this.projectKeyDoc || !this.projectKeyDoc.key_doc_url) {
      await this.showAlert('알림', '파일을 선택해주세요', false);
      return;
    }

    try {
      const response = await this.projectService
        .uploadFile(this.projectId, this.projectKeyDoc.key_doc_title, this.projectKeyDoc.key_doc_url, this.projectKeyDocCategory)
        .toPromise();
        
      console.log('Upload success:', response);
      await this.showAlert('성공', '자료가 성공적으로 업로드되었습니다.', true); // 성공 시 새로고침
      this.modalController.dismiss(true);
    } catch (error) {
      console.error('Upload failed:', error);
      await this.showAlert('실패', '업로드 중 오류가 발생했습니다.', false); // 실패 시 새로고침하지 않음
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
