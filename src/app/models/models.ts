export class KeyModel {
  visible = true;
  value = '';
  id = '';
  ref = '';
  constructor(public label: string, public pin: boolean) {
    this.id = this.label.toLowerCase().replace(' ', '_');
  }
}

export class ProjectModel {
  constructor(
    public title: string,
    public json: string,
    public keys: KeyModel[] = [new KeyModel('title', true)]
  ) {}
}
