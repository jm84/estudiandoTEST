import { Routes } from '@angular/router';
import { QuestionManagerComponent } from './features/question-manager/question-manager.component';
import { StudyComponent } from './features/study/study.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'study' },
  { path: 'study', component: StudyComponent },
  { path: 'manager', component: QuestionManagerComponent },
  { path: '**', redirectTo: 'study' }
];
