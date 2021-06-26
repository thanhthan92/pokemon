import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Generation } from './generation.model';
import { GenerationStore } from './generation.store';

@Injectable({ providedIn: 'root' })
export class GenerationService {

  constructor(private generationStore: GenerationStore, private http: HttpClient, private messageService: MessageService,) {
  }


  get() {
    this.generationStore.setLoading(true);
    return this.http.get<Generation[]>(`${environment.endpoint}generation`).pipe(
      tap((entities: any) => {
        const _entities = [...[], ...entities['results']];
        this.generationStore.setLoading(false);
        this.generationStore.set(_entities);
      },
        catchError(err => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Fail Generation load data' });
          this.generationStore.setLoading(false);
          return of(false)
        })
      ),
    );
  }

}
