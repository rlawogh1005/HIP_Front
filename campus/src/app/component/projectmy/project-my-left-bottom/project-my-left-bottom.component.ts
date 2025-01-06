import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { firstValueFrom, Subscription } from 'rxjs';
import { ApiResponse } from 'src/app/models/common/api-response.interface';
import { ProjectDocTitleResponseData } from 'src/app/models/project/project_doc_title/project_doc_title-response.interface';
import { ProjectService } from 'src/app/services/project/project.service';

@Component({
  selector: 'app-project-my-left-bottom',
  templateUrl: './project-my-left-bottom.component.html',
  styleUrls: ['./project-my-left-bottom.component.scss'],
})
export class ProjectMyLeftBottomComponent implements OnInit {
  project_id: number = 0;
  topLevelFolders: ProjectDocTitleResponseData[] = [];
  subFolders: ProjectDocTitleResponseData[] = [];
  currentFolder: ProjectDocTitleResponseData | null = null;
  showNewProjectDocTitleForm: boolean = false;
  newProjectDocTitle: string = ''; 
  isInputValid: boolean = false;
  isLoading = false;
  errorMessage: string | null = null;
  currentProjectDocTitleId: number | null = null;
  folderHistory: number[] = [];
  private routerSubscription: Subscription | null = null;
  
  //컴포넌트 초기화 시 의존성 주입을 수행
  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController
  ) {}

  // 현재 페이지 새로고침
  refreshPage() {
    window.location.reload();
  }

  // 프로젝트의 문서 페이지로 이동 
  projectDocTitlePage() {
    this.router.navigate([`/projectmy/${this.project_id}/project-title`]);
  }

  // Alert 표시 메서드
  async showAlert(header: string, message: string, refresh: boolean = false) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: '확인',
          handler: () => {
            if (refresh) {
              this.modalController.dismiss(true);
              this.refreshPage();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  // 컴포넌트 초기화 시 실행
  ngOnInit() {
    // URL 파라미터 변경 감지
    this.route.params.subscribe(async params => {
      this.project_id = params['project_id'];
      this.project_id = Number(this.project_id);
      const proejctDocTitleId = Number(params['project_doc_title_id']);
      console.log('proejctDocTitleId:', proejctDocTitleId);
      if (proejctDocTitleId) {
        console.log('ProjectDocTitleId detected:', proejctDocTitleId);  // project_doc_title_id 확인
        // 특정 폴더 보기
        await this.loadSubFolders(proejctDocTitleId);
        this.currentProjectDocTitleId = proejctDocTitleId;
      } else {
        console.log('Loading root folders');  // root 폴더 로딩 확인
        // 루트 폴더 보기
        await this.loadRootFolders();
        this.currentProjectDocTitleId = null;
      }
    });
  }

  // 컴포넌트 소멸 시 실행, 구독 해제
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // 시작 시 루트 폴더 로드
  async loadRootFolders() {
    this.isLoading = true;
    this.project_id = Number(this.project_id);
    try {
      const response = await firstValueFrom(
        this.projectService.getFirstProjectDocTitle(this.project_id)
      );
      if (response.data.project_doc_title_pa_id) {
        // 만약 title_pa_id가 있다면 (유효성 검사)
      }
      this.topLevelFolders = Array.isArray(response.data) 
        ? response.data 
        : [response.data];
    } catch (error) {
      console.error('루트 폴더 로드 에러:', error);
    } finally {
      this.isLoading = false;
    }
  }
  
  // 클릭 시 하위 폴더 로드 
  async loadSubFolders(titleId: number) {
    this.isLoading = true;
    try {
      const response = await firstValueFrom(
        this.projectService.getProjectDocTitle(this.project_id, titleId)
      );
      
      if (response.data) {
        // 현재 폴더 정보 저장
        this.currentFolder = {
          project_doc_title_id: response.data.project_doc_title_id,
          project_doc_title: response.data.project_doc_title,
          project_doc_title_pa_id: response.data.project_doc_title_pa_id,
          project_docs: response.data.project_docs,
          sub_titles: response.data.sub_titles
        };
        console.log('currentFolder:', this.currentFolder);  // 현재 폴더 정보 확인
        // 현재 선택된 title_id를 title_pa_id로 가지는 폴더들만 필터링
        this.subFolders = response.data.sub_titles
          ? response.data.sub_titles.filter(title => Number(title.project_doc_title_pa_id) === Number(titleId))
          : [];
          
        this.currentProjectDocTitleId = titleId;
      }
    } catch (error) {
      console.error('하위 폴더 로드 에러:', error);
      this.errorMessage = '폴더를 불러오는데 실패했습니다.';
    } finally {
      this.isLoading = false;
    }
  }

  // loadSubFolders 메서드를 호출하여 하위 폴더 로드
  openFolder(folder: ProjectDocTitleResponseData) {
    // 현재 폴더를 새로운 상위 폴더로 설정하고 해당 폴더의 하위 폴더를 로드
    this.currentProjectDocTitleId = folder.project_doc_title_id;
    
    this.loadSubFolders(folder.project_doc_title_id).then(() => {
      // 데이터 로드 후 URL 변경
      this.router.navigate([`/projectmy/${this.project_id}/project-title/${folder.project_doc_title_id}`]);
    });
  }

  // 상위 폴더로 이동 
  async closeFolder() {
    if (this.currentFolder?.project_doc_title_pa_id) {
      // 상위 폴더가 있는 경우
      console.log('여기',this.currentFolder.project_doc_title_id);
      await this.loadSubFolders(this.currentFolder.project_doc_title_pa_id);
      this.router.navigate([`/projectmy/${this.project_id}/project-title/${this.currentFolder.project_doc_title_id}`]);
    } else {
      // 루트로 이동
      await this.loadRootFolders();
      this.currentProjectDocTitleId = null;
      this.router.navigate([`/projectmy/${this.project_id}`]);
    }
  }

  // 새 폴더 추가 폼 표시
  showAddTitleForm() {
    this.showNewProjectDocTitleForm = true;
    this.newProjectDocTitle = '';
    this.isInputValid = false;
  }

  // 폴더 이름 입력 유효성 검사
  validateInput() {
    this.isInputValid = this.newProjectDocTitle.trim() !== '';
  }

  // 새 폴더 생성
  async createTitle() {
    if (!this.isInputValid) return;

    const ProjectDocTitleData = {
      project_doc_title: this.newProjectDocTitle,
      project_doc_title_pa_id: this.currentProjectDocTitleId || undefined
    };

    try {
      const response: ApiResponse<ProjectDocTitleResponseData> = await firstValueFrom(
        this.projectService.createProjectDocTitle(this.project_id, ProjectDocTitleData)
      );
      console.log('폴더가 성공적으로 생성되었습니다:', response);

      if (this.currentFolder) {
        this.subFolders.push(response.data);
      } else {
        this.topLevelFolders.push(response.data);
      }

      this.newProjectDocTitle = '';
      this.showNewProjectDocTitleForm = false;
      this.refreshPage();
    } catch (error) {
      console.error('폴더 생성 중 오류 발생:', error);
    }
  }

  // 폴더 삭제
  async deleteDoc(titleId: number) {
  console.log('Title ID to delete:', titleId); // 디버깅 로그 추가
  if (!titleId) {
    console.error('Invalid Title ID:', titleId);
    return;
  }

  const confirmed = confirm('이 폴더를 삭제하시겠습니까?');
  if (!confirmed) return;

  try {
    console.log('Calling deleteDocTitle with:', this.project_id, titleId);
    await firstValueFrom(this.projectService.deleteProjectDocTitle(this.project_id, titleId));
    console.log('folder deleted successfully'); // 성공 로그

    if (this.currentFolder) {
      this.subFolders = this.subFolders.filter(folder => folder.project_doc_title_id !== titleId);
    } else {
      this.topLevelFolders = this.topLevelFolders.filter(folder => folder.project_doc_title_id !== titleId); 
    }
    this.refreshPage();
  } catch (error) {
    console.error('폴더 삭제 중 오류 발생:', error);
  }
}


  // 폴더 삭제 재확인 Alert 표시
  async confirmDeletion(titleId: number) {
    const alert = await this.alertController.create({
      header: '폴더 삭제',
      message: '이 폴더를 삭제하시겠습니까?',
      buttons: [
        {
          text: '취소',
          role: 'cancel'
        },
        {
          text: '삭제',
          handler: () => {
            this.deleteDoc(titleId);
          }
        }
      ]
    });
    await alert.present();
  }
}