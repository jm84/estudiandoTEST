import { Injectable } from '@angular/core';
import { QuestionRepository } from '../contracts/question-repository';
import { Question } from '../models/question.model';

const STORAGE_KEY = 'gcp-digital-leader-questions';

@Injectable({ providedIn: 'root' })
export class LocalStorageQuestionRepositoryService implements QuestionRepository {
  public getAll(): Question[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    return JSON.parse(raw) as Question[];
  }

  public saveAll(questions: Question[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  }
}
