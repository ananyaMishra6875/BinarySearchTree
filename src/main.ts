import "./style.css";
import { BinarySearchTree, parseValues, randomValues } from "./bst";
import { layoutTree } from "./layout";
import { renderTree } from "./render";
import { checkInsert, MAX_NODES, MAX_VALUE, MIN_VALUE } from "./rules";

// ---------- Page structure ----------

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <h1>BST Practice</h1>

  <form class="controls">
    <label for="values">Values</label>
    <input id="values" autocomplete="off" placeholder="e.g. 45 or 45, 12, 88" />
    <button type="submit" data-action="insert">Insert</button>
    <button type="button" data-action="delete">Delete</button>
    <button type="button" data-action="search">Search</button>
    <button type="button" data-action="random">Random</button>
    <button type="button" data-action="clear">Clear</button>
  </form>

  <div class="messages" aria-live="polite"></div>
  <div class="tree-container"></div>
`;

const form = app.querySelector<HTMLFormElement>(".controls")!;
const input = app.querySelector<HTMLInputElement>("#values")!;
const messageArea = app.querySelector<HTMLDivElement>(".messages")!;
const treeContainer = app.querySelector<HTMLDivElement>(".tree-container")!;

// ---------- State ----------

let tree = BinarySearchTree.fromValues(randomValues(MAX_NODES, MIN_VALUE, MAX_VALUE));

type Message = { text: string; kind: "info" | "error" };

// ---------- Drawing ----------

function drawTree() {
  treeContainer.replaceChildren(); // remove the old drawing
  if (tree.root === null) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "The tree is empty. Insert some values or press Random.";
    treeContainer.append(empty);
  } else {
    treeContainer.append(renderTree(layoutTree(tree)));
  }
}

function showMessages(messages: Message[]) {
  messageArea.replaceChildren();
  for (const message of messages) {
    const line = document.createElement("p");
    line.className = message.kind;
    // textContent (not innerHTML) so typed input is shown as text, never run as HTML.
    line.textContent = message.text;
    messageArea.append(line);
  }
}

// ---------- Actions ----------

/** Reads the input box. Returns null (after showing a message) if there's nothing usable. */
function readValues(messages: Message[]): number[] | null {
  const { values, invalid } = parseValues(input.value);
  for (const token of invalid) {
    messages.push({ text: `"${token}" is not a whole number`, kind: "error" });
  }
  if (values.length === 0 && invalid.length === 0) {
    messages.push({ text: "Type one or more values first.", kind: "error" });
  }
  return values.length > 0 ? values : null;
}

function insertValues(): Message[] {
  const messages: Message[] = [];
  const values = readValues(messages);
  if (values === null) return messages;

  const { accepted, errors } = checkInsert(values, tree);
  for (const value of accepted) tree.insert(value);

  if (accepted.length > 0) {
    messages.unshift({ text: `Inserted ${accepted.join(", ")}`, kind: "info" });
    input.value = "";
  }
  for (const error of errors) messages.push({ text: error, kind: "error" });
  return messages;
}

function deleteValues(): Message[] {
  const messages: Message[] = [];
  const values = readValues(messages);
  if (values === null) return messages;

  for (const value of values) {
    if (tree.delete(value).success) messages.push({ text: `Deleted ${value}`, kind: "info" });
    else messages.push({ text: `${value} is not in the tree`, kind: "error" });
  }
  input.value = "";
  return messages;
}

function searchValues(): Message[] {
  const messages: Message[] = [];
  const values = readValues(messages);
  if (values === null) return messages;

  for (const value of values) {
    const result = tree.search(value);
    // The nodes compared on the way down, like the "Path:" output in the Java version.
    const path = result.steps.filter((step) => step.type === "compare").map((step) => step.nodeValue);
    const pathText = path.length > 0 ? ` (path: ${path.join(" → ")})` : "";
    messages.push(
      result.success
        ? { text: `Found ${value}${pathText}`, kind: "info" }
        : { text: `${value} is not in the tree${pathText}`, kind: "error" },
    );
  }
  return messages;
}

function randomTree(): Message[] {
  const values = randomValues(MAX_NODES, MIN_VALUE, MAX_VALUE);
  tree = BinarySearchTree.fromValues(values);
  return [{ text: `New random tree: ${values.join(", ")}`, kind: "info" }];
}

function clearTree(): Message[] {
  tree = new BinarySearchTree();
  return [{ text: "Cleared the tree", kind: "info" }];
}

const actions: Record<string, () => Message[]> = {
  insert: insertValues,
  delete: deleteValues,
  search: searchValues,
  random: randomTree,
  clear: clearTree,
};

function run(action: string) {
  showMessages(actions[action]());
  drawTree();
  input.focus();
}

// Pressing Enter in the input box submits the form, which means Insert.
form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the browser from reloading the page
  run("insert");
});

// The other buttons: one listener on the form handles all of them.
form.addEventListener("click", (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>("button[type=button]");
  if (button?.dataset.action) run(button.dataset.action);
});

drawTree();
