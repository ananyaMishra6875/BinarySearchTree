import "./style.css";
import { BinarySearchTree } from "./bst";
import { layoutTree } from "./layout";
import { renderTree } from "./render";

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.innerHTML = `
    <h1>BST Practice</h1>
    <div class="tree-container"></div>
  `;

  // A fixed sample tree for now; the controls (insert, delete, ...) come next.
  const tree = BinarySearchTree.fromValues([50, 30, 70, 20, 40, 60, 80, 65]);
  app.querySelector(".tree-container")!.append(renderTree(layoutTree(tree)));
}
