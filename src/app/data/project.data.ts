import { DATA_SAMPLE_LOTS } from './../pages/sandbox/data/lots.json';
import { KeyModel, ProjectModel } from './../models/models';

const keys: KeyModel[] = [
  new KeyModel('titre', true),
  new KeyModel('label', true),
  new KeyModel('nom_ref', true),
  new KeyModel('type_css', true),
  new KeyModel('prix', true),
  new KeyModel('labelPrix', false),
  new KeyModel('exposition', false),
  new KeyModel('surface_balcon', false),
  new KeyModel('surface_loggia', false),
  new KeyModel('surface_terrasse', false),
  new KeyModel('surface_jardin', false),
  new KeyModel('statut', false),
];

/* SETTING */
keys[7].ref = 'titre';
keys[8].ref = 'titre';
keys[8].value = 'titre';
keys[10].visible = false;
/* ****** */

export const DATA_SAMPLE_PROJECT = new ProjectModel(
  'Project sample',
  DATA_SAMPLE_LOTS,
  keys
);
