import { describe, expect, it } from "vitest";
import { BinarySearchTree } from "./bst";
import { layoutTree } from "./layout";

//          50
//        /    \
//      30      70
//     /  \    /  \
//   20   40  60   80
//              \
//              65
const sample = () => BinarySearchTree.fromValues([50, 30, 70, 20, 40, 60, 80, 65]);

// The tests don't care what order nodes and edges are listed in, so sort them first.
const sortedNodes = (tree: BinarySearchTree) =>
  [...layoutTree(tree).nodes].sort((a, b) => a.value - b.value);
const sortedEdges = (tree: BinarySearchTree) =>
  [...layoutTree(tree).edges].sort((a, b) => a.from - b.from || a.to - b.to);

describe("layoutTree", () => {
  it("returns nothing for an empty tree", () => {
    expect(layoutTree(new BinarySearchTree())).toEqual({
      nodes: [],
      edges: [],
      width: 0,
      height: 0,
    });
  });

  it("puts a single node at the top-left", () => {
    expect(layoutTree(BinarySearchTree.fromValues([7]))).toEqual({
      nodes: [{ value: 7, x: 0, y: 0 }],
      edges: [],
      width: 1,
      height: 1,
    });
  });

  it("uses inorder position for x and depth for y", () => {
    expect(sortedNodes(sample())).toEqual([
      { value: 20, x: 0, y: 2 },
      { value: 30, x: 1, y: 1 },
      { value: 40, x: 2, y: 2 },
      { value: 50, x: 3, y: 0 },
      { value: 60, x: 4, y: 2 },
      { value: 65, x: 5, y: 3 },
      { value: 70, x: 6, y: 1 },
      { value: 80, x: 7, y: 2 },
    ]);
  });

  it("connects every parent to its children", () => {
    expect(sortedEdges(sample())).toEqual([
      { from: 30, to: 20 },
      { from: 30, to: 40 },
      { from: 50, to: 30 },
      { from: 50, to: 70 },
      { from: 60, to: 65 },
      { from: 70, to: 60 },
      { from: 70, to: 80 },
    ]);
  });

  it("reports the grid size", () => {
    const layout = layoutTree(sample());
    expect(layout.width).toBe(8);
    expect(layout.height).toBe(4);
  });

  it("handles a tree that is just a line", () => {
    expect(sortedNodes(BinarySearchTree.fromValues([1, 2, 3]))).toEqual([
      { value: 1, x: 0, y: 0 },
      { value: 2, x: 1, y: 1 },
      { value: 3, x: 2, y: 2 },
    ]);
  });
});
