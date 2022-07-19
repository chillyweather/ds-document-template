// @ts-nocheck
import testCons from "./src/test";

//& load fonts
const loadFonts = async () => {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
};

//& create frame
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

//& convert hex to rgb
function hexToRGB(hex: string) {
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const colors = {
    r: r,
    g: g,
    b: b,
  };
  return colors;
}

//& color style creation
function createPaintStyle(name: string, hex: string) {
  const baseStyle = figma.createPaintStyle();
  baseStyle.name = name;
  const paint = {
    type: "SOLID",
    color: hexToRGB(hex),
  };
  baseStyle.paints = [paint];
  return baseStyle;
}

//& check if new styles already were created earlier
function ifStyleExists(name: String) {
  const styles = figma.getLocalPaintStyles();
  return styles.some((style) => style.name === name);
}

//& find by name and return local style
function localStyle(name: String) {
  const styles = figma.getLocalPaintStyles();
  const newStyle = styles.find((style) => style.name === name);
  return newStyle;
}

//& add color style to document
function setColorStyle(name, r, g, b) {
  return ifStyleExists(name)
    ? localStyle(name)
    : createPaintStyle(name, r, g, b);
}

//& remove non-alphanumeric symbols
function nameCleaner(name) {
  return name.replace(/[\W_]+/g, " ").trim();
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

function createStatusComponent(name, textColor, backgroundColor) {
  const statusComponent = figma.createComponent();
  const statusText = figma.createText();
  statusComponent.appendChild(statusText);

  // component settings
  statusComponent.fillStyleId = backgroundColor.id;
  // statusComponent.resize(500, 68);
  statusComponent.cornerRadius = 50;
  statusComponent.name = `status=${name}`;
  statusComponent.constraints = {
    horizontal: "MIN",
    vertical: "MIN",
  };
  //* set auto layout
  statusComponent.layoutPositioning = "AUTO";
  statusComponent.layoutMode = "HORIZONTAL";
  statusComponent.counterAxisAlignItems = "CENTER";
  statusComponent.primaryAxisAlignItems = "CENTER";

  // set padding
  statusComponent.paddingRight = 60;
  statusComponent.paddingLeft = 60;
  statusComponent.paddingTop = 60;
  statusComponent.paddingBottom = 60;

  // component text settings
  statusText.fontSize = 42;
  statusText.fillStyleId = textColor.id;
  statusText.characters = name;
  statusText.textCase = "UPPER";
  statusText.fontName = {
    family: "Inter",
    style: "Bold",
  };

  return statusComponent;
}

function createFrames(page) {
  const main = createFrame(nameCleaner(page.name), 3000, 3000, 0, 0);
  const qa = createFrame("QA", 3000, 3000, 3080, 0);
  const docs = createFrame("Documentation", 3000, 3000, 6160, 0);
  return [main, qa, docs];
}

function addTextProperty(component, textNode) {
  component.appendChild(textNode);
  component.addComponentProperty("text", "TEXT", `${component.parent.name}`);
  const objName = Object.keys(component.componentPropertyDefinitions)[0];
  textNode.componentPropertyReferences = { characters: `${objName}` };
}

//?===============================⬆️=FUNCTIONS=⬆️======================================

//^ basic color styles
const dsPrimaryColor = setColorStyle("ds-admin/Primary Color", "FC5000");
const dsSecondaryColor = setColorStyle("ds-admin/Secondary Color", "08510D");
const dsWhite = setColorStyle("ds-admin/White", "FFFFFF");
const dsBlack = setColorStyle("ds-admin/Black", "000000");
const dsDanger = setColorStyle("ds-admin/Danger", "A60404");

//^ status color styles
const pending = setColorStyle("ds-status/Pending", "9275FF");
const inProgress = setColorStyle("ds-status/In Progress", "F8CF16");
const fixes = setColorStyle("ds-status/Fixes", "E03318");
const review = setColorStyle("ds-status/Review", "04C3FC");
const tbd = setColorStyle("ds-status/TBD", "F5F6FA");
const approved = setColorStyle("ds-status/Approved", "72EDBC");

const pages = figma.root.children;
const currentPage = figma.currentPage;
const headerText = figma.createText();

loadFonts()
  .then(() => {
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
  })
  .then(() => {
    const pages = figma.root.children;
    const statusPending = createStatusComponent("pending", dsWhite, pending);
    const statusInProgress = createStatusComponent(
      "in progress",
      dsBlack,
      inProgress
    );
    const statusFixes = createStatusComponent("fixes", dsWhite, fixes);
    const statusReview = createStatusComponent("review", dsBlack, review);
    const statusTBD = createStatusComponent("tbd", dsBlack, tbd);
    const statusApproved = createStatusComponent("approved", dsBlack, approved);

    const statusInstance = statusPending.createInstance();

    const internalToolsPage = pages.filter(
      (page) => page.name === "💀 .DO NOT TOUCH!!! - internal tools"
    );

    const internalToolsFrame = internalToolsPage[0].children[0];
    const header = internalToolsFrame.children[0];

    internalToolsFrame.appendChild(statusPending);
    statusPending.x = 200;
    statusPending.y = 400;

    internalToolsFrame.appendChild(statusInProgress);
    statusInProgress.x = 200;
    statusInProgress.y = 520;

    internalToolsFrame.appendChild(statusFixes);
    statusFixes.x = 200;
    statusFixes.y = 640;

    internalToolsFrame.appendChild(statusReview);
    statusReview.x = 200;
    statusReview.y = 760;

    internalToolsFrame.appendChild(statusTBD);
    statusTBD.x = 200;
    statusTBD.y = 880;

    internalToolsFrame.appendChild(statusApproved);
    statusApproved.x = 200;
    statusApproved.y = 1000;

    header.appendChild(statusInstance);

    const status = figma.combineAsVariants(
      [
        statusPending,
        statusInProgress,
        statusFixes,
        statusReview,
        statusTBD,
        statusApproved,
      ],
      internalToolsFrame
    );
    status.name = ".DS-status";
    testCons()
  })
  .finally(() => figma.closePlugin());
