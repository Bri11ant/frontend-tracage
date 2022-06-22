import { Observable } from 'rxjs';

export function readFileAsText(file: File) {
  return new Observable<string>((subscriber) => {
    const fileReader = new FileReader();

    fileReader.onloadend = (progressData) => {
      if (typeof fileReader.result === 'string') {
        subscriber.next(fileReader.result);
      }
    };

    fileReader.readAsText(file);
  });
}
