import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Question } from '../../core/models/question.model';
import { QuestionBankService, QuestionDraft } from '../../core/services/question-bank.service';

@Component({
  selector: 'app-question-manager',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './question-manager.component.html',
  styleUrl: './question-manager.component.css'
})
export class QuestionManagerComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly questionBank = inject(QuestionBankService);

  protected readonly questions = this.questionBank.questions;
  protected readonly editingId = signal<string | null>(null);
  protected readonly isEditing = computed(() => this.editingId() !== null);

  protected readonly form = this.formBuilder.group({
    topic: ['', [Validators.required, Validators.minLength(3)]],
    prompt: ['', [Validators.required, Validators.minLength(10)]],
    optionA: ['', [Validators.required, Validators.minLength(1)]],
    optionB: ['', [Validators.required, Validators.minLength(1)]],
    optionC: ['', [Validators.required, Validators.minLength(1)]],
    optionD: ['', [Validators.required, Validators.minLength(1)]],
    correctOptionLabel: ['A' as 'A' | 'B' | 'C' | 'D', [Validators.required]],
    justification: ['', [Validators.required, Validators.minLength(10)]],
    studyTip: ['', [Validators.required, Validators.minLength(10)]]
  });

  protected isTouched(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control.touched);
  }

  protected exportJson(): void {
    this.questionBank.exportJson();
  }

  protected importJson(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.questionBank.importJson(file).then(() => { input.value = ''; });
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const draft: QuestionDraft = {
      id: this.editingId() ?? undefined,
      topic: value.topic ?? '',
      prompt: value.prompt ?? '',
      optionA: value.optionA ?? '',
      optionB: value.optionB ?? '',
      optionC: value.optionC ?? '',
      optionD: value.optionD ?? '',
      correctOptionLabel: (value.correctOptionLabel ?? 'A') as 'A' | 'B' | 'C' | 'D',
      justification: value.justification ?? '',
      studyTip: value.studyTip ?? ''
    };
    this.questionBank.saveQuestion(draft);
    this.resetForm();
  }

  protected edit(question: Question): void {
    this.editingId.set(question.id);
    const draft = this.questionBank.toDraft(question);
    this.form.patchValue(draft);
    document.getElementById('edit-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected remove(questionId: string): void {
    if (!confirm('¿Eliminar esta pregunta?')) return;
    this.questionBank.deleteQuestion(questionId);
    if (this.editingId() === questionId) this.resetForm();
  }

  protected resetForm(): void {
    this.editingId.set(null);
    this.form.reset({
      topic: '', prompt: '',
      optionA: '', optionB: '', optionC: '', optionD: '',
      correctOptionLabel: 'A', justification: '', studyTip: ''
    });
  }

  protected optionText(question: Question, label: string): string {
    const opt = question.options.find((o) => o.id === `${question.id}-${label}`);
    return opt?.text ?? '';
  }
}
