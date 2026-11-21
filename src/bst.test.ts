import { describe, expect, it } from "vitest";
import { BinarySearchTree, parseValues, randomValues } from "./bst";

//          50
//        /    \
//      30      70
//     /  \    /  \
//   20   40  60   80
//              \
//              65
const sample = () => BinarySearchTree.fromValues([50, 30, 70, 20, 40, 60, 80, 65]);

describe("insert", () => {
  it("makes the first value the root", () => {
    const tree = new BinarySearchTree();
    const result = tree.insert(50);
    expect(result.success).toBe(true);
    expect(tree.root?.value).toBe(50);
    expect(result.steps).toEqual([{ type: "insert", value: 50, parent: null, side: null }]);
  });

  it("puts smaller values left and larger values right", () => {
    const tree = sample();
    expect(tree.root?.left?.value).toBe(30);
    expect(tree.root?.right?.value).toBe(70);
    expect(tree.root?.right?.left?.right?.value).toBe(65);
  });

  it("records each comparison on the way down", () => {
    const tree = sample();
    const result = tree.insert(45);
    expect(result.steps).toEqual([
      { type: "compare", value: 45, nodeValue: 50, result: "less" },
      { type: "compare", value: 45, nodeValue: 30, result: "greater" },
      { type: "compare", value: 45, nodeValue: 40, result: "greater" },
      { type: "insert", value: 45, parent: 40, side: "right" },
    ]);
  });

  it("rejects duplicates", () => {
    const tree = sample();
    const result = tree.insert(40);
    expect(result.success).toBe(false);
    expect(result.steps.at(-1)).toEqual({ type: "duplicate", value: 40 });
    expect(tree.size()).toBe(8);
  });
});

describe("search", () => {
  it("finds a value and records the path", () => {
    const result = sample().search(65);
    expect(result.success).toBe(true);
    expect(result.steps.filter((s) => s.type === "compare").map((s) => s.nodeValue)).toEqual([
      50, 70, 60, 65,
    ]);
    expect(result.steps.at(-1)).toEqual({ type: "found", value: 65 });
  });

  it("reports values that are not there", () => {
    const result = sample().search(55);
    expect(result.success).toBe(false);
    expect(result.steps.at(-1)).toEqual({ type: "notFound", value: 55 });
  });

  it("works on an empty tree", () => {
    const result = new BinarySearchTree().search(1);
    expect(result).toEqual({ success: false, steps: [{ type: "notFound", value: 1 }] });
  });
});

describe("delete", () => {
  it("removes a leaf", () => {
    const tree = sample();
    const result = tree.delete(20);
    expect(result.success).toBe(true);
    expect(result.steps.at(-1)).toEqual({ type: "removeLeaf", value: 20 });
    expect(tree.values()).toEqual([30, 40, 50, 60, 65, 70, 80]);
  });

  it("replaces a node with one child by that child", () => {
    const tree = sample();
    const result = tree.delete(60);
    expect(result.steps.at(-1)).toEqual({ type: "removeWithChild", value: 60, child: 65 });
    expect(tree.root?.right?.left?.value).toBe(65);
  });

  it("replaces a node with two children by its inorder successor", () => {
    const tree = sample();
    const result = tree.delete(50);
    expect(result.steps.slice(-3)).toEqual([
      { type: "visit", value: 70 },
      { type: "visit", value: 60 },
      { type: "replaceWithSuccessor", value: 50, successor: 60 },
    ]);
    expect(tree.root?.value).toBe(60);
    expect(tree.root?.right?.left?.value).toBe(65); // successor's right child moved up
    expect(tree.values()).toEqual([20, 30, 40, 60, 65, 70, 80]);
  });

  it("handles a successor that is the right child itself", () => {
    const tree = BinarySearchTree.fromValues([50, 30, 70, 80]);
    tree.delete(50);
    expect(tree.root?.value).toBe(70);
    expect(tree.root?.right?.value).toBe(80);
  });

  it("can delete the root of a single-node tree", () => {
    const tree = BinarySearchTree.fromValues([5]);
    tree.delete(5);
    expect(tree.root).toBeNull();
  });

  it("reports values that are not there", () => {
    const tree = sample();
    expect(tree.delete(99).success).toBe(false);
    expect(tree.size()).toBe(8);
  });
});

describe("traverse", () => {
  it("does all four orders", () => {
    const tree = sample();
    expect(tree.traverse("inorder").values).toEqual([20, 30, 40, 50, 60, 65, 70, 80]);
    expect(tree.traverse("preorder").values).toEqual([50, 30, 20, 40, 70, 60, 65, 80]);
    expect(tree.traverse("postorder").values).toEqual([20, 40, 30, 65, 60, 80, 70, 50]);
    expect(tree.traverse("levelorder").values).toEqual([50, 30, 70, 20, 40, 60, 80, 65]);
  });

  it("returns nothing for an empty tree", () => {
    expect(new BinarySearchTree().traverse("levelorder")).toEqual({ values: [], steps: [] });
  });

  it("emits one output step per node", () => {
    const { steps } = sample().traverse("postorder");
    expect(steps.filter((s) => s.type === "output")).toHaveLength(8);
  });
});

describe("tree info", () => {
  it("measures size and height", () => {
    expect(new BinarySearchTree().height()).toBe(-1);
    expect(BinarySearchTree.fromValues([1]).height()).toBe(0);
    expect(sample().size()).toBe(8);
    expect(sample().height()).toBe(3);
  });

  it("clones without sharing nodes", () => {
    const tree = sample();
    const copy = tree.clone();
    copy.delete(50);
    expect(tree.has(50)).toBe(true);
    expect(copy.has(50)).toBe(false);
  });
});

describe("parseValues", () => {
  it("accepts commas and/or spaces", () => {
    expect(parseValues("50, 30 70,20  ,")).toEqual({ values: [50, 30, 70, 20], invalid: [] });
  });

  it("reports anything that is not a whole number", () => {
    expect(parseValues("5, abc, 2.5, -3")).toEqual({ values: [5, -3], invalid: ["abc", "2.5"] });
  });
});

describe("randomValues", () => {
  it("returns distinct values in range", () => {
    const values = randomValues(10, 1, 99);
    expect(new Set(values).size).toBe(10);
    expect(values.every((v) => v >= 1 && v <= 99)).toBe(true);
  });

  it("refuses impossible requests", () => {
    expect(() => randomValues(5, 1, 3)).toThrow(RangeError);
  });
});
