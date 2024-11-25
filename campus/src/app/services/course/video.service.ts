// video.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/common/api-response.interface';
import { VideoResponseData } from 'src/app/models/course/video/video-response.interface';
import { VideoRequestData } from 'src/app/models/course/video/video-request.interface';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private ApiUrl = 'http://localhost:3000/courses';

  constructor(private http: HttpClient) {}

  getAuthHeaders() {
    const token = localStorage.getItem('token'); // 또는 다른 저장소에서 토큰 가져오기
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  getFormDataAuthHeaders() {
    const token = localStorage.getItem('token'); // 또는 다른 저장소에서 토큰 가져오기
    return {
      Authorization: `Bearer ${token}`
    };
  }

  // private getAuthHeaders(): HttpHeaders {
  //   const token = localStorage.getItem('token');
  //   return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  // }
  
  uploadVideo(courseId: number, videoTitle: string, videoTopicId: number, file: File): Observable<ApiResponse<VideoRequestData>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('video_title', videoTitle);

    const headers = this.getFormDataAuthHeaders();
    return this.http.post<ApiResponse<VideoRequestData>>(
      `${this.ApiUrl}/${courseId}/${videoTopicId}/video/upload`,
      formData,
      { headers }
    );
  }

  // 영상 조회(PreSignedUrl GET)
  streamVideo(courseId: number, videoTopicId: number, videoId: number): Observable<ApiResponse<VideoResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<VideoResponseData>>(`${this.ApiUrl}/${courseId}/${videoTopicId}/video/${videoId}/stream`, { headers })
  }
}