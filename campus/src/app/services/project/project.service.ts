import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root',
  })

  export class ProjectService {
    private apiUrl = 'http://localhost:3000'; // 실제 API URL로 변경하세요.

    constructor(private http: HttpClient) {}

  }