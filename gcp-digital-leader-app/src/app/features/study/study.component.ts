import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Question, QuestionCheckResult } from '../../core/models/question.model';
import { QuestionBankService } from '../../core/services/question-bank.service';
import { QuizSessionService } from '../../core/services/quiz-session.service';

@Component({
  selector: 'app-study',
  imports: [CommonModule],
  templateUrl: './study.component.html',
  styleUrl: './study.component.css'
})
export class StudyComponent {
  private readonly questionBank = inject(QuestionBankService);
  private readonly quizSession = inject(QuizSessionService);

  private readonly currentIndex = signal(0);
  protected readonly selectedOptionId = signal<string | null>(null);
  protected readonly result = signal<QuestionCheckResult | null>(null);
  protected readonly questions = this.questionBank.questions;
  protected readonly currentQuestion = computed(
    () => this.questions()[this.currentIndex()] as Question | undefined
  );
  protected readonly hasQuestion = computed(() => this.questions().length > 0);
  protected readonly hasPrevious = computed(() => this.currentIndex() > 0);
  protected readonly progress = computed(() => `${this.currentIndex() + 1}/${this.questions().length}`);

  protected chooseOption(optionId: string): void {
    this.selectedOptionId.set(optionId);
    this.result.set(null);
  }

  protected checkAnswer(): void {
    const selectedOptionId = this.selectedOptionId();
    const question = this.currentQuestion();

    if (!selectedOptionId || !question) {
      return;
    }

    this.result.set(this.quizSession.checkAnswer(question, selectedOptionId));
  }

  protected previousQuestion(): void {
    const prevIndex = this.currentIndex() - 1;
    if (prevIndex < 0) return;
    this.currentIndex.set(prevIndex);
    this.selectedOptionId.set(null);
    this.result.set(null);
  }

  protected nextQuestion(): void {
    const nextIndex = this.currentIndex() + 1;
    if (nextIndex >= this.questions().length) {
      this.currentIndex.set(0);
    } else {
      this.currentIndex.set(nextIndex);
    }

    this.selectedOptionId.set(null);
    this.result.set(null);
  }
}
