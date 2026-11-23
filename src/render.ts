// Draws a TreeLayout as an SVG picture.
//
// layout.ts decides the grid position of each node (column x, row y).
// This file turns those grid positions into pixels and creates the SVG
// elements: one line per edge and one circle + label per node.
//
// Every node and edge gets a data-value attribute, so the animation code
// can find them later and highlight them (e.g. "the node holding 40").

import type { TreeLayout } from "./layout";

// SVG elements must be created in the SVG namespace, otherwise the browser
// treats <circle> as an unknown HTML tag and draws nothing.
const SVG_NS = "http://www.w3.org/2000/svg";

const NODE_RADIUS = 20;
const COLUMN_SPACING = 48; // pixels between neighbouring columns
const ROW_SPACING = 70; // pixels between rows
const PADDING = 10; // empty space around the whole tree

/** Pixel position of the centre of the node at grid column x, row y. */
function toPixels(x: number, y: number): { px: number; py: number } {
  return {
    px: PADDING + NODE_RADIUS + x * COLUMN_SPACING,
    py: PADDING + NODE_RADIUS + y * ROW_SPACING,
  };
}

/** Creates an SVG element and sets its attributes. */
function svgElement<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attributes: Record<string, string | number>,
): SVGElementTagNameMap[K] {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, String(value));
  }
  return element;
}

export function renderTree(layout: TreeLayout): SVGSVGElement {
  // Total size: the last node's centre plus its radius plus padding.
  const width = 2 * (PADDING + NODE_RADIUS) + Math.max(layout.width - 1, 0) * COLUMN_SPACING;
  const height = 2 * (PADDING + NODE_RADIUS) + Math.max(layout.height - 1, 0) * ROW_SPACING;

  // viewBox lets the picture scale down to fit small screens.
  const svg = svgElement("svg", {
    class: "tree",
    viewBox: `0 0 ${width} ${height}`,
    width,
    height,
    role: "img",
    "aria-label": "Binary search tree",
  });

  // Look up each node's pixel position by value, for drawing the edges.
  const positions = new Map(layout.nodes.map((node) => [node.value, toPixels(node.x, node.y)]));

  // Edges first, so the circles are drawn on top of the line ends.
  for (const edge of layout.edges) {
    const from = positions.get(edge.from)!;
    const to = positions.get(edge.to)!;
    svg.append(
      svgElement("line", {
        class: "edge",
        "data-from": edge.from,
        "data-to": edge.to,
        x1: from.px,
        y1: from.py,
        x2: to.px,
        y2: to.py,
      }),
    );
  }

  for (const node of layout.nodes) {
    const { px, py } = positions.get(node.value)!;

    const group = svgElement("g", { class: "node", "data-value": node.value });
    group.append(svgElement("circle", { cx: px, cy: py, r: NODE_RADIUS }));

    const label = svgElement("text", { x: px, y: py });
    label.textContent = String(node.value);
    group.append(label);

    svg.append(group);
  }

  return svg;
}
