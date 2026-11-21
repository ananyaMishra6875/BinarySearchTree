// Binary search tree, ported from the original Java version (legacy/src/BinarySearchTree.java).
//
// Every operation returns a list of Steps describing what the algorithm did,
// instead of printing to the console. The UI uses these steps to animate the
// algorithm, and practice mode will use them to check the user's answers.

export class TreeNode {
  value: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;

  constructor(value: number) {
    this.value = value;
  }
}

export type Direction = "left" | "right";
export type Comparison = "less" | "greater" | "equal";
export type TraversalOrder = "inorder" | "preorder" | "postorder" | "levelorder";

export type Step =
  /** Compared `value` with the node holding `nodeValue`. */
  | { type: "compare"; value: number; nodeValue: number; result: Comparison }
  /** Placed a new node. `parent` is null when it became the root. */
  | { type: "insert"; value: number; parent: number | null; side: Direction | null }
  /** Tried to insert a value that is already in the tree. */
  | { type: "duplicate"; value: number }
  | { type: "found"; value: number }
  | { type: "notFound"; value: number }
  /** Moved to a node without comparing (successor search, traversals). */
  | { type: "visit"; value: number }
  /** Removed a node with no children. */
  | { type: "removeLeaf"; value: number }
  /** Removed a node with one child; `child` takes its place. */
  | { type: "removeWithChild"; value: number; child: number }
  /** Node with two children: its value is replaced by its inorder successor,
   *  and the successor's original node is removed. */
  | { type: "replaceWithSuccessor"; value: number; successor: number }
  /** A traversal added this value to its output. */
  | { type: "output"; value: number };

export interface OperationResult {
  success: boolean;
  steps: Step[];
}

export interface TraversalResult {
  values: number[];
  steps: Step[];
}

function compare(value: number, nodeValue: number): Comparison {
  if (value < nodeValue) return "less";
  if (value > nodeValue) return "greater";
  return "equal";
}

export class BinarySearchTree {
  root: TreeNode | null = null;

  static fromValues(values: number[]): BinarySearchTree {
    const tree = new BinarySearchTree();
    for (const value of values) tree.insert(value);
    return tree;
  }

  insert(value: number): OperationResult {
    const steps: Step[] = [];

    if (this.root === null) {
      this.root = new TreeNode(value);
      steps.push({ type: "insert", value, parent: null, side: null });
      return { success: true, steps };
    }

    let current = this.root;
    while (true) {
      const result = compare(value, current.value);
      steps.push({ type: "compare", value, nodeValue: current.value, result });

      if (result === "equal") {
        steps.push({ type: "duplicate", value });
        return { success: false, steps };
      }

      const side: Direction = result === "less" ? "left" : "right";
      const next = current[side];
      if (next === null) {
        current[side] = new TreeNode(value);
        steps.push({ type: "insert", value, parent: current.value, side });
        return { success: true, steps };
      }
      current = next;
    }
  }

  search(value: number): OperationResult {
    const steps: Step[] = [];
    let current = this.root;

    while (current !== null) {
      const result = compare(value, current.value);
      steps.push({ type: "compare", value, nodeValue: current.value, result });

      if (result === "equal") {
        steps.push({ type: "found", value });
        return { success: true, steps };
      }
      current = result === "less" ? current.left : current.right;
    }

    steps.push({ type: "notFound", value });
    return { success: false, steps };
  }

  delete(value: number): OperationResult {
    const steps: Step[] = [];

    // Find the node, remembering how we got there.
    let parent: TreeNode | null = null;
    let side: Direction | null = null;
    let current = this.root;

    while (current !== null) {
      const result = compare(value, current.value);
      steps.push({ type: "compare", value, nodeValue: current.value, result });
      if (result === "equal") break;

      parent = current;
      side = result === "less" ? "left" : "right";
      current = current[side];
    }

    if (current === null) {
      steps.push({ type: "notFound", value });
      return { success: false, steps };
    }

    if (current.left !== null && current.right !== null) {
      // Two children: find the inorder successor (smallest node in the right subtree).
      let successorParent = current;
      let successor = current.right;
      steps.push({ type: "visit", value: successor.value });
      while (successor.left !== null) {
        successorParent = successor;
        successor = successor.left;
        steps.push({ type: "visit", value: successor.value });
      }

      steps.push({ type: "replaceWithSuccessor", value, successor: successor.value });

      // The successor has no left child, so splicing it out is easy.
      if (successorParent === current) successorParent.right = successor.right;
      else successorParent.left = successor.right;
      current.value = successor.value;
    } else {
      // Zero or one child: the child (or null) takes this node's place.
      const child = current.left ?? current.right;
      steps.push(
        child === null
          ? { type: "removeLeaf", value }
          : { type: "removeWithChild", value, child: child.value },
      );

      if (parent === null || side === null) this.root = child;
      else parent[side] = child;
    }

    return { success: true, steps };
  }

  traverse(order: TraversalOrder): TraversalResult {
    const values: number[] = [];
    const steps: Step[] = [];
    const output = (node: TreeNode) => {
      values.push(node.value);
      steps.push({ type: "output", value: node.value });
    };

    const walk = (node: TreeNode | null) => {
      if (node === null) return;
      steps.push({ type: "visit", value: node.value });
      if (order === "preorder") output(node);
      walk(node.left);
      if (order === "inorder") output(node);
      walk(node.right);
      if (order === "postorder") output(node);
    };

    if (order === "levelorder") {
      // Breadth-first: this is the version that was broken in the Java code
      // (it returned early whenever the tree was NOT empty).
      const queue: TreeNode[] = this.root ? [this.root] : [];
      while (queue.length > 0) {
        const node = queue.shift()!;
        steps.push({ type: "visit", value: node.value });
        output(node);
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }
    } else {
      walk(this.root);
    }

    return { values, steps };
  }

  has(value: number): boolean {
    return this.search(value).success;
  }

  /** All values in sorted order. */
  values(): number[] {
    return this.traverse("inorder").values;
  }

  size(): number {
    const count = (node: TreeNode | null): number =>
      node === null ? 0 : 1 + count(node.left) + count(node.right);
    return count(this.root);
  }

  /** Number of edges on the longest root-to-leaf path. Empty tree = -1, single node = 0. */
  height(): number {
    const measure = (node: TreeNode | null): number =>
      node === null ? -1 : 1 + Math.max(measure(node.left), measure(node.right));
    return measure(this.root);
  }

  /** Deep copy, so the UI can keep "before" snapshots for animation and undo. */
  clone(): BinarySearchTree {
    const copy = (node: TreeNode | null): TreeNode | null => {
      if (node === null) return null;
      const result = new TreeNode(node.value);
      result.left = copy(node.left);
      result.right = copy(node.right);
      return result;
    };
    const tree = new BinarySearchTree();
    tree.root = copy(this.root);
    return tree;
  }
}

/** Parses input like "50, 30 70,20" into numbers. Anything that isn't a whole number is reported as invalid. */
export function parseValues(input: string): { values: number[]; invalid: string[] } {
  const values: number[] = [];
  const invalid: string[] = [];
  for (const token of input.split(/[\s,]+/).filter((t) => t !== "")) {
    if (/^-?\d+$/.test(token)) values.push(Number(token));
    else invalid.push(token);
  }
  return { values, invalid };
}

/** `count` distinct random whole numbers between min and max (inclusive). */
export function randomValues(
  count: number,
  min: number,
  max: number,
  random: () => number = Math.random,
): number[] {
  if (count > max - min + 1) {
    throw new RangeError(`Can't pick ${count} distinct values between ${min} and ${max}`);
  }
  const picked = new Set<number>();
  while (picked.size < count) {
    picked.add(min + Math.floor(random() * (max - min + 1)));
  }
  return [...picked];
}
