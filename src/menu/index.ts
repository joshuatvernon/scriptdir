import inquirer, { Answers, QuestionCollection } from 'inquirer';
import rx from 'rxjs';

export class Menu {
  private questions!: any;
  private answers!: any;

  start(): void {
    this.questions = new rx.Subject();
    this.answers = inquirer.prompt(this.questions as QuestionCollection<Answers>).ui.process;
  }

  async stop(): Promise<void> {
    await this.questions.complete();
  }

  list(message: string, choices: string[]): Promise<string> {
    return new Promise((resolve) => {
      const subscriber = this.answers.subscribe(({ answer }: any) => {
        subscriber.unsubscribe();
        resolve(answer);
      });

      this.questions.next({
        type: 'list',
        name: 'list',
        message,
        choices
      });
    });
  }

  input(message: string): Promise<string> {
    return new Promise((resolve) => {
      const subscriber = this.answers.subscribe(({ answer }: any) => {
        subscriber.unsubscribe();
        resolve(answer);
      });

      this.questions.next({
        type: 'input',
        name: 'input',
        message
      });
    });
  }

  confirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      const subscriber = this.answers.subscribe(({ answer }: any) => {
        subscriber.unsubscribe();
        resolve(answer);
      });

      this.questions.next({
        type: 'confirm',
        name: 'confirm',
        message,
        default: false
      });
    });
  }
}

export const menu = new Menu();
