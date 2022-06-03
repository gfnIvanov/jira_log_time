export function parseDate(someDate) {
  return !someDate ? new Date().toISOString().split('T')[0] : someDate.split('.').reverse().join('-');
}

export function empty(item) {
  if (item === false || item === 'undefined' || item === '' || item === null) {
    return true;
  }
}
