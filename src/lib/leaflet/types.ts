export type LeafletDocumentRecord = {
  $type: "pub.leaflet.document";
  title: string;
  description?: string;
  publishedAt?: string;
  publication: string;
  author: string;
  pages: LeafletPage[];
};

export type LeafletPage = LeafletLinearPage | LeafletCanvasPage;

export type LeafletLinearPage = {
  $type: "pub.leaflet.pages.linearDocument";
  id?: string;
  blocks: LeafletLinearBlock[];
};

export type LeafletLinearBlock = {
  $type: "pub.leaflet.pages.linearDocument#block";
  alignment?: LeafletAlignment;
  block: LeafletBlock;
};

export type LeafletAlignment =
  | "lex:pub.leaflet.pages.linearDocument#textAlignLeft"
  | "lex:pub.leaflet.pages.linearDocument#textAlignCenter"
  | "lex:pub.leaflet.pages.linearDocument#textAlignRight"
  | "lex:pub.leaflet.pages.linearDocument#textAlignJustify";

export type LeafletBlock =
  | LeafletTextBlock
  | LeafletHeaderBlock
  | LeafletBlockquoteBlock
  | LeafletImageBlock
  | LeafletHorizontalRuleBlock
  | LeafletCodeBlock
  | LeafletMathBlock
  | LeafletWebsiteBlock
  | LeafletIframeBlock
  | LeafletButtonBlock
  | LeafletUnorderedListBlock
  | LeafletOrderedListBlock
  | LeafletPageLinkBlock
  | LeafletBskyPostBlock
  | LeafletPollBlock;

export type LeafletFacet = {
  index: { byteStart: number; byteEnd: number };
  features: Array<LeafletFacetFeature>;
};

export type LeafletFacetFeature = {
  $type: string;
  [k: string]: unknown;
};

export type LeafletBlobRef = {
  ref: { $link: string };
  mimeType: string;
  size: number;
};

export type LeafletTextBlock = {
  $type: "pub.leaflet.blocks.text";
  plaintext: string;
  facets?: LeafletFacet[];
};

export type LeafletHeaderBlock = {
  $type: "pub.leaflet.blocks.header";
  level?: number;
  plaintext: string;
  facets?: LeafletFacet[];
};

export type LeafletBlockquoteBlock = {
  $type: "pub.leaflet.blocks.blockquote";
  plaintext: string;
  facets?: LeafletFacet[];
};

export type LeafletImageBlock = {
  $type: "pub.leaflet.blocks.image";
  image: LeafletBlobRef;
  alt?: string;
  aspectRatio: { width: number; height: number };
};

export type LeafletHorizontalRuleBlock = {
  $type: "pub.leaflet.blocks.horizontalRule";
};

export type LeafletCodeBlock = {
  $type: "pub.leaflet.blocks.code";
  plaintext: string;
  language?: string;
  syntaxHighlightingTheme?: string;
};

export type LeafletMathBlock = {
  $type: "pub.leaflet.blocks.math";
  tex: string;
};

export type LeafletWebsiteBlock = {
  $type: "pub.leaflet.blocks.website";
  previewImage?: LeafletBlobRef;
  title?: string;
  description?: string;
  src: string;
};

export type LeafletIframeBlock = {
  $type: "pub.leaflet.blocks.iframe";
  url: string;
  height?: number;
};

export type LeafletButtonBlock = {
  $type: "pub.leaflet.blocks.button";
  text: string;
  url: string;
};

export type LeafletListItem = {
  $type: string;
  content: LeafletBlock;
  children?: LeafletListItem[];
};

export type LeafletUnorderedListBlock = {
  $type: "pub.leaflet.blocks.unorderedList";
  children: LeafletListItem[];
};

export type LeafletOrderedListBlock = {
  $type: "pub.leaflet.blocks.orderedList";
  children: LeafletListItem[];
  startIndex?: number;
};

export type LeafletPageLinkBlock = {
  $type: "pub.leaflet.blocks.page";
  id: string;
};

export type LeafletBskyPostBlock = {
  $type: "pub.leaflet.blocks.bskyPost";
  postRef: { uri: string; cid: string };
};

export type LeafletPollBlock = {
  $type: "pub.leaflet.blocks.poll";
  pollRef: { uri: string; cid: string };
};

export type LeafletCanvasPage = {
  $type: "pub.leaflet.pages.canvas";
  id: string;
  blocks: unknown[];
};
