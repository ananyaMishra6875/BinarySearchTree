package ics3uFinal;

// imports 
import javax.swing.*;
import java.awt.*;

public class TreePanel extends JPanel {
	private Node root;
	private static final int TREE_Y = 80;
	
	// constructor
	public TreePanel(Node root) {
		this.root = root;
		setBackground(new Color(227,234,224));
		//setPreferredSize(new Dimension(100, 100));
	}
	
	// set root
	public void setRoot(Node root) {
		this.root = root;
	}
	
	@Override
	protected void paintComponent(Graphics g) {
		// call superclass
		super.paintComponent(g);
		if (root != null) {
			// draw the tree from the root
			drawTree(g, root, getWidth()/2, TREE_Y, getWidth()/4);
		}
	}
	
	// draw each node and its children
	private void drawTree(Graphics g, Node node, int x, int y, int xOffset) {
		// set font for nodes
		setFont(new Font("Minecraft", Font.BOLD, 12));
		if (node.left != null) {
			// recursively draw subtree
			g.drawLine(x, y, x - xOffset, y + 50);
            drawTree(g, node.left, x - xOffset, y + 50, xOffset / 2);
		}
		if (node.right != null) {
			// recursively draw subtree
			g.drawLine(x, y, x + xOffset, y + 50);
            drawTree(g, node.right, x + xOffset, y + 50, xOffset / 2);
		}
		// draw node
		g.setColor(new Color(170,202,154));
        g.fillOval(x - 15, y - 15, 30, 30);
        g.setColor(Color.BLACK);
        g.drawString(String.valueOf(node.value), (node.value > 9) ? x - 8 : x - 5, y + 5);
	}
}