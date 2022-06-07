export function parseDate(someDate) {
  return !someDate ? new Date().toISOString().split('T')[0] : someDate.split('.').reverse().join('-');
}

export function empty(item) {
  let result = false;
  if (typeof (item) === 'object') {
    if (Array.isArray(item)) {
      result = item.length === 0;
    } else {
      result = Object.keys(item).length === 0;
    }
  } else {
    result = item === false || item === 'undefined' || item === '' || item === null;
  }
  return result;
}
