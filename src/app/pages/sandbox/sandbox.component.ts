import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.scss'],
})
export class SandboxComponent implements OnInit {
  ROOT_PATH = 'http://localhost:3000/api/';
  PROJECT_PATH = this.ROOT_PATH + 'projects/';

  project?: { title: string; data: string };
  projectList$ = new Observable<string[]>();

  resultType?:
    | 'project list'
    | 'select project'
    | 'create project'
    | 'open project'
    | 'update project';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // this.onGetProjectList();
  }

  onCreateProject(title: string) {
    if (!title || !title.trim()) {
      alert('Invalid parameter!');
      return;
    }
    title = title.trim();

    this.resultType = 'create project';
    this.http.post(this.PROJECT_PATH, { title }).subscribe(
      (res) =>
        (this.project = res as {
          title: string;
          data: string;
        })
    );
  }

  onOpenProject(title: string, data: string) {
    if (!title || !title.trim() || !data || !data.trim()) {
      alert('Invalid parameter!');
      return;
    }
    title = title.trim();
    data = data.trim();

    this.resultType = 'open project';
    this.http.post(this.PROJECT_PATH, { title, data }).subscribe(
      (res) =>
        (this.project = res as {
          title: string;
          data: string;
        })
    );
  }

  onUpdateProject(title: string, data: string) {
    if (!title || !title.trim() || !data || !data.trim()) {
      alert('Invalid parameter!');
      return;
    }
    title = title.trim();
    data = data.trim();

    this.resultType = 'update project';
    this.http.put(this.PROJECT_PATH, { title, data }).subscribe(
      (res) =>
        (this.project = res as {
          title: string;
          data: string;
        })
    );
  }

  onSelectProject(title: string) {
    if (!title || !title.trim()) {
      alert('Invalid parameter!');
      return;
    }
    title = title.trim();

    this.resultType = 'select project';
    const id = title.toLowerCase().replace(' ', '_');

    this.http.get(this.PROJECT_PATH + id).subscribe(
      (res) =>
        (this.project = res as {
          title: string;
          data: string;
        })
    );
  }

  onGetProjectList() {
    this.resultType = 'project list';
    this.projectList$ = this.http.get(this.PROJECT_PATH) as Observable<
      string[]
    >;
  }
}
