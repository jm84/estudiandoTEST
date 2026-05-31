import { Inject, Injectable, computed, signal } from '@angular/core';
import { QUESTION_REPOSITORY, QuestionRepository } from '../contracts/question-repository';
import { SEED_QUESTIONS } from '../data/seed-questions';
import { AnswerOption, Question } from '../models/question.model';

export interface QuestionDraft {
  id?: string;
  topic: string;
  prompt: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOptionLabel: 'A' | 'B' | 'C' | 'D';
  justification: string;
  studyTip: string;
}

@Injectable({ providedIn: 'root' })
export class QuestionBankService {
  private readonly questionsSignal = signal<Question[]>([]);
  public readonly questions = computed(() => this.questionsSignal());

  public constructor(@Inject(QUESTION_REPOSITORY) private readonly repository: QuestionRepository) {
    const stored = this.repository.getAll();
    if (stored.length > 0) {
      this.questionsSignal.set(stored);
      return;
    }

    this.questionsSignal.set(SEED_QUESTIONS);
    this.repository.saveAll(SEED_QUESTIONS);
  }

  public saveQuestion(draft: QuestionDraft): void {
    const nextQuestion = this.toQuestion(draft);
    const current = this.questionsSignal();
    const existingIndex = current.findIndex((q) => q.id === nextQuestion.id);

    if (existingIndex === -1) {
      const updated = [...current, nextQuestion];
      this.questionsSignal.set(updated);
      this.repository.saveAll(updated);
      return;
    }

    const updated = [...current];
    updated[existingIndex] = nextQuestion;
    this.questionsSignal.set(updated);
    this.repository.saveAll(updated);
  }

  public exportJson(): void {
    const json = JSON.stringify(this.questionsSignal(), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'gcp-questions.json';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  public importJson(file: File): Promise<void> {
    return file.text().then((raw) => {
      const questions = JSON.parse(raw) as Question[];
      this.questionsSignal.set(questions);
      this.repository.saveAll(questions);
    });
  }

  public deleteQuestion(questionId: string): void {
    const updated = this.questionsSignal().filter((question) => question.id !== questionId);
    this.questionsSignal.set(updated);
    this.repository.saveAll(updated);
  }

  public toDraft(question: Question): QuestionDraft {
    const optionById = new Map(question.options.map((option) => [option.id, option.text]));
    const correctLabel = this.toLabel(question.correctOptionId);
    return {
      id: question.id,
      topic: question.topic,
      prompt: question.prompt,
      optionA: optionById.get(this.optionId(question.id, 'A')) ?? '',
      optionB: optionById.get(this.optionId(question.id, 'B')) ?? '',
      optionC: optionById.get(this.optionId(question.id, 'C')) ?? '',
      optionD: optionById.get(this.optionId(question.id, 'D')) ?? '',
      correctOptionLabel: correctLabel,
      justification: question.justification,
      studyTip: question.studyTip
    };
  }

  private toQuestion(draft: QuestionDraft): Question {
    const id = draft.id ?? crypto.randomUUID();
    const options: AnswerOption[] = [
      { id: this.optionId(id, 'A'), text: draft.optionA.trim() },
      { id: this.optionId(id, 'B'), text: draft.optionB.trim() },
      { id: this.optionId(id, 'C'), text: draft.optionC.trim() },
      { id: this.optionId(id, 'D'), text: draft.optionD.trim() }
    ];

    return {
      id,
      topic: draft.topic.trim(),
      prompt: draft.prompt.trim(),
      options,
      correctOptionId: this.optionId(id, draft.correctOptionLabel),
      justification: draft.justification.trim(),
      studyTip: draft.studyTip.trim()
    };
  }

  private optionId(questionId: string, label: 'A' | 'B' | 'C' | 'D'): string {
    return `${questionId}-${label}`;
  }

  private toLabel(optionId: string): 'A' | 'B' | 'C' | 'D' {
    const candidate = optionId.split('-').at(-1);
    if (candidate === 'A' || candidate === 'B' || candidate === 'C' || candidate === 'D') {
      return candidate;
    }

    return 'A';
  }
}
