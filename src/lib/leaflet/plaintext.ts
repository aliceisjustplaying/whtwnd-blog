import type {
  LeafletBlock,
  LeafletDocumentRecord,
  LeafletLinearPage,
  LeafletListItem,
} from "#/lib/leaflet/types";

export function extractLeafletPlaintext(record: LeafletDocumentRecord) {
  const pages = record.pages.filter(
    (page): page is LeafletLinearPage =>
      page?.$type === "pub.leaflet.pages.linearDocument",
  );
  const fragments: string[] = [];

  for (const page of pages) {
    for (const block of page.blocks) {
      collectBlockText(block.block, fragments);
    }
  }

  return fragments.join("\n\n");
}

function collectBlockText(block: LeafletBlock, fragments: string[]) {
  switch (block.$type) {
    case "pub.leaflet.blocks.text":
    case "pub.leaflet.blocks.header":
    case "pub.leaflet.blocks.blockquote":
      fragments.push(block.plaintext);
      break;
    case "pub.leaflet.blocks.code":
      fragments.push(block.plaintext);
      break;
    case "pub.leaflet.blocks.math":
      fragments.push(block.tex);
      break;
    case "pub.leaflet.blocks.website":
      fragments.push(block.title || block.src);
      if (block.description) fragments.push(block.description);
      break;
    case "pub.leaflet.blocks.button":
      fragments.push(block.text);
      break;
    case "pub.leaflet.blocks.unorderedList":
    case "pub.leaflet.blocks.orderedList":
      block.children.forEach((child) => collectListItem(child, fragments));
      break;
    default:
      break;
  }
}

function collectListItem(item: LeafletListItem, fragments: string[]) {
  collectBlockText(item.content, fragments);
  item.children?.forEach((child) => collectListItem(child, fragments));
}
