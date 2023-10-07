const width = window.innerWidth;
const height = window.innerHeight;

const numNodes = 50;
const nodes = Array.from({ length: numNodes }, (_, index) => ({
  id: index,
  x: Math.random() * width,
  y: Math.random() * height,
  z: 0
}));

const links = Array.from({ length: numNodes }, () => ({
  source: Math.floor(Math.random() * numNodes),
  target: Math.floor(Math.random() * numNodes)
}));

const rotation = { x: 0, y: 0 };

const simulation = d3
  .forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id).distance(50))
  .force("charge", d3.forceManyBody().strength(-100))
  .force("center", d3.forceCenter(width / 2, height / 2));

const svg = d3
  .select("#graph-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .call(
    d3.drag()
      .on("start", () => {})
      .on("drag", draggedSvg)
  );

const link = svg
  .selectAll(".link")
  .data(links)
  .enter()
  .append("line")
  .attr("class", "link")
  .attr("stroke", "#999")
  .attr("stroke-opacity", 0.6);

const node = svg
  .selectAll(".node")
  .data(nodes)
  .enter()
  .append("circle")
  .attr("class", "node")
  .attr("r", 5)
  .attr("fill", "#1f77b4")
  .call(
    d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
  );

function dragstarted(event, d) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(event, d) {
  d.fx = event.x;
  d.fy = event.y;
}

function dragended(event, d) {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

function draggedSvg(event) {
    const dx = event.dx;
    const dy = event.dy;
  
    // Define rotation speed
    const rotationSpeed = 0.00005;
  
    // Update rotation angles based on mouse drag movement
    rotation.y += dx * rotationSpeed;
    rotation.x -= dy * rotationSpeed;
  
    // Limit rotation angles to prevent distortion
    rotation.x = Math.max(-Math.PI / 5, Math.min(Math.PI / 5, rotation.x));
  
    // Apply rotation transformations to the nodes and links
    nodes.forEach(node => {
      const x = node.x - width / 2;
      const y = node.y - height / 2;
      const z = node.z;
      const cosX = Math.cos(rotation.x);
      const sinX = Math.sin(rotation.x);
      const cosY = Math.cos(rotation.y);
      const sinY = Math.sin(rotation.y);
  
      node.x = x * cosX * cosY - y * sinX + z * cosX * sinY + width / 2;
      node.y = x * cosY * sinX + y * cosX + z * sinX * sinY + height / 2;
      node.z = -x * sinY + z * cosY;
    });
  
    // Update the simulation
    simulation.nodes(nodes);
  }
  

simulation.on("tick", () => {
  link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  node.attr("cx", d => d.x).attr("cy", d => d.y);
});
