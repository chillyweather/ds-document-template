// @ts-nocheck
import setColorStyle from "../src/colorStyles.ts"
//^ basic color styles
const dsWhite = setColorStyle("ds-admin/White", "FFFFFF");
const dsBlack = setColorStyle("ds-admin/Black", "000000");

//^ status color styles
const pending = setColorStyle("ds-status/Pending", "9275FF");
const inProgress = setColorStyle("ds-status/In Progress", "F8CF16");
const fixes = setColorStyle("ds-status/Fixes", "E03318");
const review = setColorStyle("ds-status/Review", "04C3FC");
const tbd = setColorStyle("ds-status/TBD", "F5F6FA");
const approved = setColorStyle("ds-status/Approved", "72EDBC");

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

function buildStatusComponents() {
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
}

export { buildStatusComponents };
