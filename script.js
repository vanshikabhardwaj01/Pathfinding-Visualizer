const ROWS = 20;
const COLS = 50;
let START_NODE_ROW = 10;
let START_NODE_COL = 10;
let FINISH_NODE_ROW = 10;
let FINISH_NODE_COL = 40;

const gridContainer = document.getElementById('grid');
let grid = [];
let isDrawingWalls = false;
let isMovingStart = false;
let isMovingEnd = false;
let isVisualizing = false;

// Initialize Grid
function initializeGrid() {
    gridContainer.innerHTML = '';
    grid = [];
    for (let row = 0; row < ROWS; row++) {
        const currentRow = [];
        const rowElement = document.createElement('div');
        rowElement.className = 'grid-row';
        for (let col = 0; col < COLS; col++) {
            const node = createNode(row, col);
            rowElement.appendChild(node.element);
            currentRow.push(node);
        }
        gridContainer.appendChild(rowElement);
        grid.push(currentRow);
    }
}

function createNode(row, col) {
    const element = document.createElement('div');
    element.className = 'node';
    element.id = `node-${row}-${col}`;
    
    if (row === START_NODE_ROW && col === START_NODE_COL) element.classList.add('start-node');
    if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) element.classList.add('end-node');

    // Event Listeners for drawing walls
    element.addEventListener('mousedown', () => handleMouseDown(row, col));
    element.addEventListener('mouseenter', () => handleMouseEnter(row, col));
    element.addEventListener('mouseup', handleMouseUp);

    return { row, col, isWall: false, isVisited: false, distance: Infinity, previousNode: null, element };
}

function handleMouseDown(row, col) {
    if (isVisualizing) return;
    if (row === START_NODE_ROW && col === START_NODE_COL) {
        isMovingStart = true;
    } else if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
        isMovingEnd = true;
    } else {
        isDrawingWalls = true;
        toggleWall(row, col);
    }
}

function handleMouseEnter(row, col) {
    if (isVisualizing) return;
    if (isDrawingWalls) {
        toggleWall(row, col);
    } else if (isMovingStart) {
        moveSpecialNode('start', row, col);
    } else if (isMovingEnd) {
        moveSpecialNode('end', row, col);
    }
}

function handleMouseUp() {
    isDrawingWalls = false;
    isMovingStart = false;
    isMovingEnd = false;
}

function toggleWall(row, col) {
    const node = grid[row][col];
    if (node.element.classList.contains('start-node') || node.element.classList.contains('end-node')) return;
    node.isWall = !node.isWall;
    node.element.classList.toggle('wall-node');
}

function moveSpecialNode(type, row, col) {
    const node = grid[row][col];
    if (node.isWall) return;
    if (type === 'start' && !(row === FINISH_NODE_ROW && col === FINISH_NODE_COL)) {
        grid[START_NODE_ROW][START_NODE_COL].element.classList.remove('start-node');
        START_NODE_ROW = row;
        START_NODE_COL = col;
        node.element.classList.add('start-node');
    } else if (type === 'end' && !(row === START_NODE_ROW && col === START_NODE_COL)) {
        grid[FINISH_NODE_ROW][FINISH_NODE_COL].element.classList.remove('end-node');
        FINISH_NODE_ROW = row;
        FINISH_NODE_COL = col;
        node.element.classList.add('end-node');
    }
}

// Global Mouse Up
document.body.addEventListener('mouseup', handleMouseUp);
document.body.addEventListener('mouseleave', handleMouseUp);

// --- Algorithms ---

async function dijkstra() {
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const endNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    startNode.distance = 0;
    
    const unvisitedNodes = getAllNodes();
    
    while (unvisitedNodes.length > 0) {
        unvisitedNodes.sort((a, b) => a.distance - b.distance);
        const closestNode = unvisitedNodes.shift();
        
        if (closestNode.isWall) continue;
        if (closestNode.distance === Infinity) return false;
        
        closestNode.isVisited = true;
        
        if (closestNode !== startNode && closestNode !== endNode) {
            closestNode.element.classList.add('visited-node');
            await sleep(10);
        }
        
        if (closestNode === endNode) return true;
        
        updateUnvisitedNeighbors(closestNode);
    }
    return false;
}

async function bfs() {
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const endNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const queue = [startNode];
    startNode.isVisited = true;

    while (queue.length > 0) {
        const currentNode = queue.shift();

        if (currentNode !== startNode && currentNode !== endNode) {
            currentNode.element.classList.add('visited-node');
            await sleep(10);
        }

        if (currentNode === endNode) return true;

        const neighbors = getUnvisitedNeighbors(currentNode);
        for (const neighbor of neighbors) {
            neighbor.isVisited = true;
            neighbor.previousNode = currentNode;
            queue.push(neighbor);
        }
    }
    return false;
}

async function dfs() {
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const endNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const stack = [startNode];
    
    while (stack.length > 0) {
        const currentNode = stack.pop();
        
        if (!currentNode.isVisited) {
            currentNode.isVisited = true;
            
            if (currentNode !== startNode && currentNode !== endNode) {
                currentNode.element.classList.add('visited-node');
                await sleep(20); // slightly slower to show depth
            }

            if (currentNode === endNode) return true;

            const neighbors = getUnvisitedNeighbors(currentNode).reverse(); // Reverse for typical DFS visual
            for (const neighbor of neighbors) {
                if (!neighbor.isVisited) {
                    neighbor.previousNode = currentNode;
                    stack.push(neighbor);
                }
            }
        }
    }
    return false;
}

function updateUnvisitedNeighbors(node) {
    const neighbors = getUnvisitedNeighbors(node);
    for (const neighbor of neighbors) {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
    }
}

function getUnvisitedNeighbors(node) {
    const neighbors = [];
    const { row, col } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < ROWS - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < COLS - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(n => !n.isVisited && !n.isWall);
}

function getAllNodes() {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

async function animatePath(endNode) {
    const path = [];
    let currentNode = endNode;
    while (currentNode !== null) {
        path.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    
    for (let i = 1; i < path.length - 1; i++) {
        await sleep(30);
        path[i].element.classList.remove('visited-node');
        path[i].element.classList.add('path-node');
    }
}

function clearBoard() {
    for (const row of grid) {
        for (const node of row) {
            node.isVisited = false;
            node.distance = Infinity;
            node.previousNode = null;
            if (!node.isWall && !node.element.classList.contains('start-node') && !node.element.classList.contains('end-node')) {
                node.element.className = 'node';
            } else if (node.element.classList.contains('visited-node') || node.element.classList.contains('path-node')) {
                node.element.classList.remove('visited-node');
                node.element.classList.remove('path-node');
            }
        }
    }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

document.getElementById('visualizeBtn').addEventListener('click', async () => {
    if (isVisualizing) return;
    clearBoard();
    isVisualizing = true;
    const algo = document.getElementById('algorithm').value;
    
    let found = false;
    if (algo === 'dijkstra') {
        found = await dijkstra();
    } else if (algo === 'bfs') {
        found = await bfs();
    } else if (algo === 'dfs') {
        found = await dfs();
    }

    if (found) {
        await animatePath(grid[FINISH_NODE_ROW][FINISH_NODE_COL]);
    }
    isVisualizing = false;
});

document.getElementById('clearBoardBtn').addEventListener('click', () => {
    if (isVisualizing) return;
    initializeGrid();
});

// Start
initializeGrid();
