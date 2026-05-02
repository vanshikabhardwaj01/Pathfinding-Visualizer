# Algorithmic Pathfinding Visualizer 🚀

> An interactive web application to visualize complex graph algorithms like Dijkstra's, BFS, and DFS in real-time.

## 🌟 Features
- **Real-Time Visualization:** Watch algorithms explore the grid step-by-step.
- **Interactive Grid:** Click and drag to create impenetrable walls and mazes.
- **Draggable Nodes:** Dynamically move the Start and End nodes.
- **Multiple Algorithms:** 
  - `Dijkstra's Algorithm` (Guarantees shortest path)
  - `Breadth-First Search` (Guarantees shortest path in unweighted graphs)
  - `Depth-First Search` (Explores deeply, does not guarantee shortest path)

## 🛠️ Tech Stack
- **Languages:** HTML5, CSS3, Vanilla JavaScript
- **Algorithms:** Graph Traversal (DSA)
- **Deployment:** Ready for GitHub Pages

## 🚀 Quick Start
No installation required! Just open `index.html` in your web browser.

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/Pathfinding-Visualizer.git
   \`\`\`
2. Open `index.html` in Chrome/Firefox/Safari.

## 🧠 Technical Learnings
- **Graph Theory in Practice:** Modeled a DOM grid as an unweighted graph where each cell represents a node.
- **Asynchronous JavaScript:** Used `async/await` and Promises to pause execution and create the visual animation effect of algorithm execution.
- **DOM Manipulation:** Managed 1000+ DOM elements dynamically without performance degradation.
