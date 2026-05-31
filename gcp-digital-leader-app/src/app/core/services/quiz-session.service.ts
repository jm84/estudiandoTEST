import { Injectable } from '@angular/core';
import { Question, QuestionCheckResult } from '../models/question.model';

@Injectable({ providedIn: 'root' })
export class QuizSessionService {
  public checkAnswer(question: Question, selectedOptionId: string): QuestionCheckResult {
    const correctOption = question.options.find((option) => option.id === question.correctOptionId);
    if (!correctOption) {
      throw new Error(`Question ${question.id} has no valid correct option.`);
    }

    const isCorrect = selectedOptionId === question.correctOptionId;

    return {
      isCorrect,
      selectedOptionId,
      correctOptionId: question.correctOptionId,
      correctOptionText: correctOption.text,
      explanation: question.justification,
      studyTip: isCorrect ? undefined : question.studyTip
    };
  }
}
