// @ts-nocheck

import setColorStyle from "./colorStyles.ts";
import { nameCleaner } from "./utils.ts";
import { addTextProperty } from "./figmaUtils.ts";


function createFrame(
  name = "Main",
  xSize: number,
  ySize: number,
  xPosition: number,
  yPosition = 0
) {
  const frame = figma.createFrame();
  frame.x = xPosition;
  frame.y = yPosition;
  frame.resize(xSize, ySize);
  frame.name = name;
  return frame;
}

//& create header component
function createHeader(page, title) {
  const header = figma.createComponent();
  const pageName = page.name;
  header.fillStyleId = dsPrimaryColor.id;
  header.constraints = {
    horizontal: "STRETCH",
    vertical: "MIN",
  };
  header.name = "Header";
  const textElement = title;
  header.appendChild(textElement);
  textElement.x = 50;
  textElement.y = 50;
  textElement.fontSize = 82;
  textElement.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  textElement.characters = `${nameCleaner(pageName)}`;
  textElement.textCase = "UPPER";
  textElement.fontName = {
    family: "Inter",
    style: "Bold",
  };

  header.layoutPositioning = "AUTO";
  header.layoutMode = "HORIZONTAL";
  header.counterAxisAlignItems = "CENTER";
  header.primaryAxisAlignItems = "SPACE_BETWEEN";
  header.paddingLeft = 100;
  header.paddingRight = 100;
  header.resize(3000, 200);

  // header.appendChild(status);
  return header;
}

function createFrames(page) {
  const main = createFrame(nameCleaner(page.name), 3000, 3000, 0, 0);
  const qa = createFrame("QA", 3000, 3000, 3080, 0);
  const docs = createFrame("Documentation", 3000, 3000, 6160, 0);
  return [main, qa, docs];
}

//^ basic color styles
const dsPrimaryColor = setColorStyle("ds-admin/Primary Color", "FC5000");
const dsSecondaryColor = setColorStyle("ds-admin/Secondary Color", "08510D");
const dsDanger = setColorStyle("ds-admin/Danger", "A60404");

const pages = figma.root.children;
const currentPage = figma.currentPage;
const headerText = figma.createText();

function buildFrames() {
  const header = createHeader(currentPage, headerText);
  pages.forEach((node) => {
    if (!(node.name.startsWith("⎯") || node.name.startsWith("⋯"))) {
      const currentFrames = createFrames(node);
      currentFrames.forEach((frame) => node.appendChild(frame));
      const frames = node.children.filter((node) => node.type === "FRAME");

      //& find admin page
      if (node.name === "💀 .DO NOT TOUCH!!! - internal tools") {
        frames.forEach((frame) => {
          if (frame.name === node.name.replace(/[\W_]+/g, " ").trim()) {
            frame.appendChild(header);
            addTextProperty(header, headerText);
            header.children[0].characters = `${frame.name}`;
            frame.fillStyleId = dsDanger.id;
          } else {
            const instance = header.createInstance();
            instance.children[0].characters = `${frame.name}`;
            frame.appendChild(instance);
          }
        });
      } else {
        frames.forEach((frame) => {
          const instance = header.createInstance();
          instance.children[0].characters = `${frame.name}`;
          frame.appendChild(instance);
        });
      }
    }
  });
}

export default buildFrames;
