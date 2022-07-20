// @ts-nocheck

function addTextProperty(component, textNode) {
  component.appendChild(textNode);
  component.addComponentProperty("text", "TEXT", `${component.parent.name}`);
  const objName = Object.keys(component.componentPropertyDefinitions)[0];
  textNode.componentPropertyReferences = { characters: `${objName}` };
}

export { addTextProperty };
