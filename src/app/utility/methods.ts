export function escapeRegExp(str: string, _for?: 'JSON') {
  if (_for && _for === 'JSON') {
    return str.trim().replace(/\\/g, '\\$&').replace(/"/g, '\\$&'); // $& means the whole matched string
  }
  return str.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function replaceAll(str: string, find: string, replace: string) {
  return str.trim().replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

export function generateID(label: string) {
  let id = label
    .trim()
    .toLowerCase()
    .replace(/[.*+?^,=/!:${}()|[\]\\ '"&]/g, '_')
    .replace(/[0-9]/g, '_$1');
  return id;
}
