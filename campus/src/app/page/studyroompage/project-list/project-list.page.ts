import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { ProjectResponseData } from 'src/app/models/project/projects/projects-response.interface';
import { ProjectService } from 'src/app/services/project/project.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.page.html',
  styleUrls: ['./project-list.page.scss'],
})
export class ProjectListPage implements OnInit {
  projectsList: ProjectResponseData[] = [];

  constructor(
    private projectService: ProjectService,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.loadProjects();
  }

  async loadProjects() {
    // 로딩
    const loading = await this.loadingController.create({
      message: '프로젝트를 불러오는 중...',
    });
    await loading.present();

    this.projectService.getAllProjects().subscribe({
      next: (response) => {
        this.projectsList = response.data;
        console.log('프로젝트 목록:', this.projectsList);
        loading.dismiss();
      },
      error: async (error) => {
        console.error('프로젝트 목록 로드 중 오류 발생:', error);
        loading.dismiss();
        const alert = await this.alertController.create({
          header: '프로젝트 목록 로드 오류',
          message: '프로젝트 목록을 불러오는 중 오류가 발생했습니다.',
          buttons: ['확인'],
        });
        await alert.present();
      }
    })
  }

  enterProject(projectId: number) {
    this.navCtrl.navigateForward(['/projectmy', projectId]);
  }
}
