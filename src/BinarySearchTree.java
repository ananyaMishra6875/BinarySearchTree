package ics3uFinal;

// imports
import java.util.*;

public class BinarySearchTree {
	
	// create scanner and random
	Scanner s = new Scanner(System.in);
	Random r = new Random();
	
	// constant values for the bst
	final int LIMIT = 99;
	final int NODE_AMT = 10;
	
	List<Node> nodeVals = new ArrayList<>();
	Node root;
	
	// get input from user / randomize input for nodes
	public void input(String nodeInputs) {
		String[] inputs = nodeInputs.split(",\\s*"); // for however many spaces
		
		for (String input : inputs) {
			// validate tree size
			if (nodeVals.size() >= NODE_AMT) {
				System.out.println("Limit reached; cannot add more than " + NODE_AMT + " nodes");
				break;
			}
			
			// validate input range
			if (!inRange(input)) {
				System.out.println("Input not in range: "+input);
				continue;
			}
			
			int value = Integer.parseInt(input);
			insert(value);
		}
		System.out.print(nodeVals);
	}
	
	public void randInput() {
		System.out.print("Randomized input: ");
		while (nodeVals.size() < NODE_AMT) {
			Node node = new Node(r.nextInt(1,LIMIT+1));
			if (!hasDuplicates(node.value,nodeVals)) {
				insert(node.value);
				System.out.print(node.value + " ");
			}
		}
	}
	
	// helper method to check if node values are in range
	private boolean inRange(String node) {
		try {
			return Integer.parseInt(node) > 0 && Integer.parseInt(node) <= LIMIT;
		} catch (NumberFormatException e) {
			return false;
		}
	}
	
	// helper method to check for duplicates in node value list
	private boolean hasDuplicates(int nodeValue, List<Node> nodeVals) {
        for (Node val: nodeVals){
            if (nodeValue == val.value){
                return true;
            }
        }
        return false;
	}
	
	// insert node
	public void insert(int value) {
		if (nodeVals.size() >= NODE_AMT) {
			System.out.println("Limit reached; cannot add more than " + NODE_AMT + " nodes");
			return;
		}
		if (value < 1 || value > LIMIT) {
			System.out.println("Input not in range: "+value);
			return;
		}
		if (hasDuplicates(value, nodeVals)) {
			System.out.println("Duplicate found: "+value);
			return;
		}
		root = insertNode(root, value);
		nodeVals.add(new Node(value));
	}
	
	// helper method to insert node
	private Node insertNode(Node current, int value) {
		// create new node if current is null
		if (current == null) {
			return new Node(value);
		}
		
		// if value is smaller than current value, it goes left
		if (value < current.value) {
			current.left = insertNode(current.left, value);
		}
		
		// if value is greater than current value, it goes right
		else if (value > current.value) {
			current.right = insertNode(current.right, value);
		}
		
		return current;
	}
	
	// delete node
	public void delete(int value) {
		// if the tree is empty (root is null)
		if (root == null) {
			System.out.println("The tree is empty");
			return;
		}
		if (!hasDuplicates(value, nodeVals)) {
	        System.out.println("Value not found in tree: " + value);
	        return;
	    }
		root = deleteNode(root, value);
		// update nodeVals
		updateNodes();
		System.out.println("Deleted node with value: " + value);
	}
		
	// helper method to delete node
	private Node deleteNode(Node current, int value) {
		// nothing to delete
		if (current == null) {
			return null;
		}
		
		// if the value is equal to the current node's value, take care of the children
		if (value == current.value) {
			// if node has no children
			if (current.left == null && current.right == null) {
				return null;
			}
			
			// if node has 1 child
			if (current.left == null) {
				return current.right; // return right child if left is null
			}
			
			if (current.right == null) {
				return current.left; // return left child if right is null
			}
			
			// if node has 2 children
			Node minNode = findMin(current.right); // find inorder successor -> smallest node in right subtree
	        current.value = minNode.value; // replace current with inorder successor
	        current.right = deleteNode(current.right, minNode.value); // delete the inorder successor
	        return current;
		}
		
		// if the value is less than the current value
		if (value < current.value) {
	        current.left = deleteNode(current.left, value);
	    } 
		// if the value is greater than the current value
		else {
	        current.right = deleteNode(current.right, value);
	    }
		    return current;
	}
	
	// helper method to find the min value
	private Node findMin(Node root) {
	    // if you can't go further left then return the current root, otherwise keep going
		return (root.left == null) ? root : findMin(root.left);
	}
	
	// helper method to update nodeVals using inorder traversal
	private void updateNodes() {
		nodeVals.clear();
	    inOrderTraversal(root);
	}
	
	// traverse through the tree
	public void traverse(int method, Node node) {
		switch(method) {
			// inorder traversal
			case 0 -> {
				System.out.print("\nInorder: ");
				inOrderTraversal(node);
			}
			
			// preorder traversal
			case 1 -> {
				System.out.print("\nPreorder: ");
				preOrderTraversal(node);
			}
			
			// postorder traversal
			case 2 -> {
				System.out.print("\nPostorder: ");
				postOrderTraversal(node);
			}
			
			// levelorder traversal (bfs)
			case 3 -> {
				System.out.print("\nLevelorder: ");
				levelOrderTraversal(node);
			}
		}
	}
	
	// helper method to do inorder traversal (left-root-right)
	private void inOrderTraversal(Node node) {
		if (node != null) {
	        inOrderTraversal(node.left);
	        nodeVals.add(node);
	        System.out.print(node.value + " ");
	        inOrderTraversal(node.right);
	    }
	}
	
	// helper method to do preorder traversal (root-left-right)
	private void preOrderTraversal(Node node) {
		if (node != null) {
			System.out.print(node.value + " ");
			preOrderTraversal(node.left);
			preOrderTraversal(node.right);
		}
	}
	
	// helper method to do postorder traversal (left-right-root)
	private void postOrderTraversal(Node node) {
		if (node != null) {
			postOrderTraversal(node.left);
			postOrderTraversal(node.right);
			System.out.print(node.value + " ");
		}
	}
	
	// helper method to do levelorder traversal (breadth-first) (left to right)
	private void levelOrderTraversal(Node node) {
		if (node != null) {
			return;
		}
		
		// create a linkedlist queue
		Queue<Node> queue = new LinkedList<>();
		queue.add(root);
		
		while (!queue.isEmpty()) {
			// remove and return head of queue (poll())
			Node current = queue.poll();
			System.out.print(current.value + " ");
			
			// enqueue left
			if (current.left != null) {
				queue.add(current.left);
			}
			
			// enqueue right
			if (current.right != null) {
				queue.add(current.right);
			}
		}
	}
	
	// search for node in the tree
	public void search(int searchVal) {
		searchNode(searchVal);
	}
	
	// helper method to search for node in the tree
	private boolean searchNode(int value) {
		// create a list to keep track of the path
		List<Integer> path = new ArrayList<>();
		Node current = root;
		
		while (current != null) {
			// add current node's value to path
			path.add(current.value);
			
			if (current.value == value) {
				// print path once value is found
				printPath(path);
				return true;
			}
			
			// decide whether to go left or right
			current = (current.value > value) ? current.left : current.right;
		}
		
		// print path and return false if value is not found
		printPath(path);
		return false;
	}
	
	// helper method to print the path of searched node
	private void printPath(List<Integer> path) {
		System.out.print("Path: ");
	    for (int i = 0; i < path.size(); i++) {
	        System.out.print(path.get(i));
	        if (i < path.size() - 1) {
	            System.out.print(" > ");
	        }
	    }
	    System.out.println();
	}
	
	// get root 
	public Node getRoot() {
		return root;
	}
	
	// get list of node values
	public List<Node> getNodeVals() {
		return nodeVals;
	}
}