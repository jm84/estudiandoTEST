import { inject } from '@angular/core';
import { QUESTION_REPOSITORY } from './contracts/question-repository';
import { Question } from './models/question.model';

export function questionsLoaderInitializer(): () => Promise<void> {
  const repository = inject(QUESTION_REPOSITORY);

  return async () => {
    if (repository.getAll().length > 0) {
      return;
    }

    try {
      const response = await fetch('questions.json');
      if (!response.ok) return;
      const questions = (await response.json()) as Question[];
      repository.saveAll(questions);
    } catch {
      // Si falla la carga del JSON el banco simplemente arranca vacío
    }
  };
}
