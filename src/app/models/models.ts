import { generateID } from '../utility/methods';

export class KeyModel {
  visible = true;
  value = '';
  id = '';
  ref = '';
  constructor(public label: string, public pin: boolean, ref?: string) {
    this.id = generateID(label);
    if (ref) {
      this.ref = ref;
    }
  }
}

export class ProjectModel {
  constructor(
    public title: string,
    public json: string,
    public keys: KeyModel[] = [
      new KeyModel('titre', true),
      new KeyModel('label', false, 'titre'),
      new KeyModel('nom_ref', false, 'titre'),
      new KeyModel('nom', false, 'titre'),
      new KeyModel('type', true),
      new KeyModel('type_css', false, 'type'),
      new KeyModel('etage', false),
      new KeyModel('statut', false),
      new KeyModel('surface', false),
      new KeyModel('terrasse', false),
    ]
  ) {}
}
