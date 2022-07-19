// @ts-nocheck
import { buildStatusComponents } from "./src/statusComponent.ts";
import setColorStyle from "./src/colorStyles.ts";
import buildFrames from "./src/frames.ts";

//& load fonts
const loadFonts = async () => {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
};

loadFonts()
  .then(() => {
    buildFrames();
    buildStatusComponents();
  })
  .finally(() => figma.closePlugin());
