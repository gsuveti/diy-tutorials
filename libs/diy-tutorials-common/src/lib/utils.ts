const uuidv4 = require('uuid/v4')

export function serializeAttributes(attributes = {}) {
  const orderedAttributes = {};
  Object.keys(attributes).sort().forEach(function (key) {
    orderedAttributes[key] = attributes[key];
  });
  return btoa(JSON.stringify(orderedAttributes));
}


export function deserializeAttributes(attributes = "e30=") {
  return JSON.parse(atob(attributes));
}

export function generateUUID() {
  return uuidv4();
}


