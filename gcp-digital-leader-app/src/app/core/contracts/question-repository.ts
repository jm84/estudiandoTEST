import { InjectionToken } from '@angular/core';
import { Question } from '../models/question.model';

export interface QuestionRepository {
  getAll(): Question[];
  saveAll(questions: Question[]): void;
}

export const QUESTION_REPOSITORY = new InjectionToken<QuestionRepository>('QUESTION_REPOSITORY');
