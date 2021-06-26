import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Version } from './version.model';
import { VersionsStore } from './versions.store';

@Injectable({ providedIn: 'root' })
export class VersionsService {

  constructor(private versionsStore: VersionsStore, private http: HttpClient,
    private messageService: MessageService) {
  }


  get() {
    this.versionsStore.setLoading(true);
    return this.http.get<Version[]>(`${environment.endpoint}version`).pipe(
      tap((entities: any) => {
        const _entities = [...[], ...entities['results']];
        this.versionsStore.setLoading(false);
        this.versionsStore.set(_entities);
      },
        catchError(err => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Fail Version load data' });
          this.versionsStore.setLoading(false);
          return of(false)
        })
      ),
    );
  }
}
