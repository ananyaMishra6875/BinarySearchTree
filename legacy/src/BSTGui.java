package ics3uFinal;

// imports
import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionListener;

// main class for the gui of the bst visualization
public class BSTGui extends JFrame {
	private TreePanel treePanel;
	private BinarySearchTree bst;
	private static final int WIDTH = 840;
	private static final int HEIGHT = 400;
	private static final int buttonPanelWidth = 200;
	private static final int buttonPanelHeight = 300;
	private static final int treePanelWidth = WIDTH - buttonPanelWidth;
	private static final int treePanelHeight = HEIGHT - 40;
	
	// constructor
	public BSTGui() {
		// initialize bst and treepanel with root
		bst = new BinarySearchTree();
		treePanel = new TreePanel(bst.getRoot());
		
		// title panel at the top
	    titlePanelSetup();
		
		// set layout for main frame
		setLayout(new BorderLayout()); 
		add(treePanel,BorderLayout.CENTER);
		
		// create and set layout for button panel 
		JPanel buttonPanel = new JPanel(new GridLayout(6, 1, 0, 10));
		buttonPanel.setBackground(new Color(158,193,140));
		buttonPanel.setPreferredSize(new Dimension(buttonPanelWidth, buttonPanelHeight));
		buttonPanel.setBorder(BorderFactory.createEmptyBorder(50, 10, 10, -170));
		add(buttonPanel, BorderLayout.WEST);
		
		// create and add buttons
		createButton(buttonPanel, "Input Values", e -> inputValues());
        createButton(buttonPanel, "Randomize Values", e -> randomizeValues());
        createButton(buttonPanel, "Insert Node", e -> insertNode());
        createButton(buttonPanel, "Delete Node", e -> deleteNode());
        createButton(buttonPanel, "Search Node", e -> searchNode());
        createButton(buttonPanel, "Traverse Tree", e -> traverseTree());
        
        // set frame properties
 		setTitle("Binary Search Tree Simulator");
 		setSize(WIDTH,HEIGHT);
 		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
 		setVisible(true);
	}
    
	// set up title panel in a method
	private void titlePanelSetup() {
		JPanel titlePanel = new JPanel();
	    JLabel titleLabel = new JLabel("Binary Search Tree Simulator", SwingConstants.CENTER);
	    titleLabel.setFont(new Font("Minecraft", Font.BOLD, 20));
	    titlePanel.setBackground(new Color(122,160,103));
	    titlePanel.add(titleLabel);
	    titlePanel.setBounds(0, 0, WIDTH, 40);
	    add(titlePanel);
	    titlePanel.repaint();
	}
	
	// create button
    private void createButton(JPanel panel, String title, ActionListener action) {
    	JButton button = new JButton(title);
//        button.setAlignmentX(Component.CENTER_ALIGNMENT);
        button.setBackground(Color.DARK_GRAY);
        button.setForeground(Color.WHITE);
        button.setFont(new Font("Minecraft", Font.PLAIN, 12));
        button.addActionListener(action);
        panel.add(button);
        panel.add(Box.createRigidArea(new Dimension(0, 10))); // adds space between buttons
    }

    // input values
    private void inputValues() {
        String nodeInputs = JOptionPane.showInputDialog("Enter values to input tree: ");
        bst.input(nodeInputs);
        updateTreePanel();
    }

    // randomize values
    private void randomizeValues() {
        bst.randInput();
        JOptionPane.showMessageDialog(null, "Randomized node values:\n" + bst.getNodeVals());
        updateTreePanel();
    }

    // insert node
    private void insertNode() {
        int value = Integer.parseInt(JOptionPane.showInputDialog("Enter value to insert: "));
        bst.insert(value);
        updateTreePanel();
    }

    // delete node
    private void deleteNode() {
        int value = Integer.parseInt(JOptionPane.showInputDialog("Enter value to delete: "));
        bst.delete(value);
        updateTreePanel();
    }
    
    // search for node
    private void searchNode() {
        int value = Integer.parseInt(JOptionPane.showInputDialog("Enter value to search: "));
        bst.search(value);
        updateTreePanel();
    }

    // traverse tree
    private void traverseTree() {
        String[] options = {"Inorder", "Preorder", "Postorder", "Levelorder"};
        int choice = JOptionPane.showOptionDialog(null, "Select method of traversal:", "Traverse Node", JOptionPane.DEFAULT_OPTION, JOptionPane.INFORMATION_MESSAGE, null, options, options[0]);
        bst.traverse(choice, bst.getRoot());
        updateTreePanel();
    }

    // update treepanel
    private void updateTreePanel() {
        treePanel.setRoot(bst.getRoot());
        treePanel.repaint();
//        titlePanelSetup();
    }
	
	// run the tree gui
	public static void main(String[] args) {
		new BSTGui();
	}
}