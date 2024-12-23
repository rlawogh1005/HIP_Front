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
  showNewTopicForm: boolean = false;
  newTopicTitle: string = ''; 
  isInputValid: boolean = false;
  isLoading = false;
  errorMessage: string | null = null;
  currentTopicId: number | null = null;
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
  docTopicPage() {
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
      const topicId = params['topicId'];
      
      if (topicId) {
        console.log('Topic ID detected:', topicId);  // topic_id 확인
        // 특정 폴더 보기
        await this.loadSubFolders(+topicId);
        this.currentTopicId = +topicId;
      } else {
        console.log('Loading root folders');  // root 폴더 로딩 확인
        // 루트 폴더 보기
        await this.loadRootFolders();
        this.currentTopicId = null;
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
    try {
      const response = await firstValueFrom(
        this.projectService.getFirstDocTitle(this.project_id)
      );
      if (response.data.pa_title_id) {
        // 만약 pa_title_id가 있다면 (유효성 검사)
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
        this.projectService.getDocTitle(this.project_id, titleId)
      );
      
      if (response.data) {
        // 현재 폴더 정보 저장
        this.currentFolder = {
          project_doc_id: response.data.project_doc_id,
          title: response.data.title,
          pa_title_id: response.data.pa_title_id,
          project_docs: response.data.project_docs,
          sub_titles: response.data.sub_titles
        };
        
        // 현재 선택된 topic_id를 pa_topic_id로 가지는 폴더들만 필터링
        this.subFolders = response.data.sub_titles
          ? response.data.sub_titles.filter(title => title.pa_title_id === titleId)
          : [];
          
        this.currentTopicId = titleId;
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
    this.currentTopicId = folder.project_doc_id;
    
    this.loadSubFolders(folder.project_doc_id).then(() => {
      // 데이터 로드 후 URL 변경
      this.router.navigate([`/projectmy/${this.project_id}/project-title/${folder.project_doc_id}`]);
    });
  }

  // 상위 폴더로 이동 
  async closeFolder() {
    if (this.currentFolder?.pa_title_id) {
      // 상위 폴더가 있는 경우
      await this.loadSubFolders(this.currentFolder.pa_title_id);
      this.router.navigate([`/projectmy/${this.project_id}/project-title/${this.currentFolder.pa_title_id}`]);
    } else {
      // 루트로 이동
      await this.loadRootFolders();
      this.currentTopicId = null;
      this.router.navigate([`/projectmy/${this.project_id}/project-title`]);
    }
  }

  // 새 폴더 추가 폼 표시
  showAddTitleForm() {
    this.showNewTopicForm = true;
    this.newTopicTitle = '';
    this.isInputValid = false;
  }

  // 폴더 이름 입력 유효성 검사
  validateInput() {
    this.isInputValid = this.newTopicTitle.trim() !== '';
  }

  // 새 폴더 생성
  async createTitle() {
    if (!this.isInputValid) return;

    const docTitleData = {
      title: this.newTopicTitle
    };

    try {
      const response: ApiResponse<ProjectDocTitleResponseData> = await firstValueFrom(
        this.projectService.createDocTitle(this.project_id, docTitleData)
      );
      console.log('폴더가 성공적으로 생성되었습니다:', response);

      if (this.currentFolder) {
        this.subFolders.push(response.data);
      } else {
        this.topLevelFolders.push(response.data);
      }

      this.newTopicTitle = '';
      this.showNewTopicForm = false;
    } catch (error) {
      console.error('폴더 생성 중 오류 발생:', error);
    }
  }

  // 폴더 삭제
  async deleteDoc(titleId: number) {
    const confirmed = confirm('이 폴더를 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      await firstValueFrom(this.projectService.deleteDocTitle(this.project_id, titleId));
      if (this.currentFolder) {
        this.subFolders = this.subFolders.filter(folder => folder.project_doc_id !== titleId);
      } else {
        this.topLevelFolders = this.topLevelFolders.filter(folder => folder.project_doc_id !== titleId);
      }
      this.router.navigate([`/projectmy/${this.project_id}/doc-topics/${titleId}`]);
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