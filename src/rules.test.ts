import { describe, expect, it } from "vitest";
import { BinarySearchTree } from "./bst";
import { checkInsert } from "./rules";

// 8 nodes: 2 more fit before the 10-node limit.
const eightNodes = () => BinarySearchTree.fromValues([50, 30, 70, 20, 40, 60, 80, 65]);

describe("checkInsert", () => {
  it("accepts valid values into an empty tree", () => {
    expect(checkInsert([50, 30, 70], new BinarySearchTree())).toEqual({
      accepted: [50, 30, 70],
      errors: [],
    });
  });

  it("accepts nothing when given nothing", () => {
    expect(checkInsert([], new BinarySearchTree())).toEqual({ accepted: [], errors: [] });
  });

  it("rejects values outside 1-99 but keeps the edges", () => {
    expect(checkInsert([0, 1, 99, 100, -5], new BinarySearchTree())).toEqual({
      accepted: [1, 99],
      errors: [
        "0 is out of range (1-99)",
        "100 is out of range (1-99)",
        "-5 is out of range (1-99)",
      ],
    });
  });

  it("rejects values already in the tree", () => {
    const tree = BinarySearchTree.fromValues([50, 30]);
    expect(checkInsert([30, 40], tree)).toEqual({
      accepted: [40],
      errors: ["30 is already in the tree"],
    });
  });

  it("rejects a value repeated in the same input", () => {
    expect(checkInsert([5, 5], new BinarySearchTree())).toEqual({
      accepted: [5],
      errors: ["5 is already in the tree"],
    });
  });

  it("stops at the node limit and ignores the rest", () => {
    expect(checkInsert([1, 2, 3, 4], eightNodes())).toEqual({
      accepted: [1, 2],
      errors: ["Limit reached: at most 10 nodes"],
    });
  });

  it("only counts accepted values towards the limit", () => {
    // 50 and 200 are rejected, so they don't use up the 2 free spots.
    expect(checkInsert([50, 200, 1, 2], eightNodes())).toEqual({
      accepted: [1, 2],
      errors: ["50 is already in the tree", "200 is out of range (1-99)"],
    });
  });

  it("rejects everything when the tree is already full", () => {
    const full = BinarySearchTree.fromValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(checkInsert([11], full)).toEqual({
      accepted: [],
      errors: ["Limit reached: at most 10 nodes"],
    });
  });

  it("does not change the tree", () => {
    const tree = eightNodes();
    checkInsert([1, 2], tree);
    expect(tree.size()).toBe(8);
  });
});
