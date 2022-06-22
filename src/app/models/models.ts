import { generateID } from '../utility/methods';

export class KeyModel {
  visible = true;
  value = '';
  id = '';
  ref = '';
  constructor(public label: string, public pin: boolean) {
    this.id = generateID(label);
  }
}

export class ProjectModel {
  constructor(
    public title: string,
    public json: string,
    public keys: KeyModel[] = [new KeyModel('titre', true)]
  ) {}
}
