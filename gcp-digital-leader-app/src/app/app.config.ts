import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { QUESTION_REPOSITORY } from './core/contracts/question-repository';
import { LocalStorageQuestionRepositoryService } from './core/services/local-storage-question-repository.service';
import { questionsLoaderInitializer } from './core/questions-loader';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: QUESTION_REPOSITORY, useClass: LocalStorageQuestionRepositoryService },
    {
      provide: APP_INITIALIZER,
      useFactory: questionsLoaderInitializer,
      multi: true
    }
  ]
};
