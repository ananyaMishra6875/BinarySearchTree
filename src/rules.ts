// The app's rules for which values can be inserted, from the original Java
// version: values from 1 to 99, at most 10 nodes, and no duplicates.
//
// These live here rather than in bst.ts because they are rules of this app,
// not of binary search trees: the tree itself works with any numbers.

import type { BinarySearchTree } from "./bst";

export const MIN_VALUE = 1;
export const MAX_VALUE = 99;
export const MAX_NODES = 10;

export interface InsertCheck {
  /** Values that can be inserted, in the order they were given. */
  accepted: number[];
  /** One message per problem, in the order the problems were found. */
  errors: string[];
}

/**
 * Decides which of `values` may be inserted into `tree`. Does not change the tree.
 *
 * Each value is checked in order, like this:
 *   1. If the tree plus the values accepted so far already has MAX_NODES nodes,
 *      add the error "Limit reached: at most 10 nodes" and stop checking:
 *      the remaining values are ignored.
 *   2. If the value is below MIN_VALUE or above MAX_VALUE,
 *      add the error "<value> is out of range (1-99)" and skip it.
 *   3. If the value is already in the tree, or was already accepted earlier
 *      in this same list, add the error "<value> is already in the tree" and skip it.
 *   4. Otherwise, accept it.
 *
 * Build the messages from the constants above (e.g. `${MAX_NODES}`), not by
 * typing 10 or 99, so changing a constant also changes the message.
 */
export function checkInsert(values: number[], tree: BinarySearchTree): InsertCheck {
  const accepted: number[] = [];
  const errors: string[] = [];

  for (const value of values) {
    // Limit -> count what's in the tree plus what's already accepted so far
    if (tree.size() + accepted.length >= MAX_NODES) {
      errors.push(`Limit reached: at most ${MAX_NODES} nodes`);
      break; // Stop checking/ignore remaining values
    }

    // Range
    if (value < MIN_VALUE || value > MAX_VALUE) {
      errors.push(`${value} is out of range (${MIN_VALUE}-${MAX_VALUE})`);
      continue; // Skip this value -> check the next one
    }

    // Duplicate -> already in the tree or earlier in this list
    if (tree.has(value) || accepted.includes(value)) {
      errors.push(`${value} is already in the tree`);
      continue;
    }

    // Passed every check
    accepted.push(value);
  }

  return { accepted, errors };
}
