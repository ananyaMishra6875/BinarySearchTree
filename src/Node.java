package ics3uFinal;

public class Node {
	
	// create a value and left/right child for the node
	int value;
	Node left;
	Node right;
	
	// constructor
	public Node(int value) {
		this.value = value;
		left = null;
		right = null;
	}
	
	// convert from Node to String
	public Node toNode(String str) {
		return new Node(Integer.parseInt(str));
	}
		
	@ Override
	public String toString() {
		return "" + value;
	}
}