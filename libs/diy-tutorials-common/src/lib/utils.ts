const uuidv4 = require('uuid/v4')

export function serializeAttributes(attributes = {}) {
  return btoa(JSON.stringify(attributes));
}


export function deserializeAttributes(attributes = "e30=") {
  return JSON.parse(atob(attributes));
}

export function generateUUID() {
  return uuidv4();
}


