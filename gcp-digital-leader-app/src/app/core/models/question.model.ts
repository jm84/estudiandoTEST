export interface AnswerOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  topic: string;
  prompt: string;
  options: AnswerOption[];
  correctOptionId: string;
  justification: string;
  studyTip: string;
}

export interface QuestionCheckResult {
  isCorrect: boolean;
  selectedOptionId: string;
  correctOptionId: string;
  correctOptionText: string;
  explanation: string;
  studyTip?: string;
}
