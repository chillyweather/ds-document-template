// @ts-nocheck

function nameCleaner(name) {
  return name.replace(/[\W_]+/g, " ").trim();
}

export { nameCleaner };
