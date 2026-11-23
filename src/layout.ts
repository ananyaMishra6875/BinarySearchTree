// Works out where each node of a tree should be drawn.
//
// Positions are in grid units, not pixels: x is a column and y is a row.
// The renderer multiplies them by a spacing to get pixel positions, so this
// file only has to think about the shape of the tree.
//
//   x = the node's position in inorder order (smallest value = column 0).
//       Inorder visits values in sorted order, so every node gets its own
//       column, nothing overlaps, and smaller values are always further left.
//   y = the node's depth (root = row 0, its children = row 1, ...).

import type { BinarySearchTree, TreeNode } from "./bst";

export interface NodePosition {
  value: number;
  x: number;
  y: number;
}

/** A line from a parent node to one of its children, identified by their values. */
export interface Edge {
  from: number;
  to: number;
}

export interface TreeLayout {
  nodes: NodePosition[];
  edges: Edge[];
  /** Number of columns used (= number of nodes). */
  width: number;
  /** Number of rows used (= tree height + 1, or 0 for an empty tree). */
  height: number;
}

export function layoutTree(tree: BinarySearchTree): TreeLayout {
  const nodes: NodePosition[] = [];
  const edges: Edge[] = [];

  let column = 0; // the next free column, shared by every call to walk

  const walk = (node: TreeNode | null, depth: number) => {
    if (node === null) return;

    // Left subtree first -> everything smaller gets the columns to the left of this node
    walk(node.left, depth + 1);

    // This node takes the next free column
    nodes.push({ value: node.value, x: column, y: depth });
    column++;

    // Right subtree last -> everything larger gets the columns to the right of this node
    walk(node.right, depth + 1);

    // One edge per child that exists
    if (node.left !== null) edges.push({ from: node.value, to: node.left.value });
    if (node.right !== null) edges.push({ from: node.value, to: node.right.value });
  };

  walk(tree.root, 0);
  return { nodes, edges, width: nodes.length, height: tree.height() + 1 };
}
