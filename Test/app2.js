const width = window.innerWidth;
const height = window.innerHeight;

const numNodes = 50;
const nodes = Array.from({ length: numNodes }, (_, index) => ({ id: index }));
const links = Array.from({ length: numNodes }, () => ({
  source: Math.floor(Math.random() * numNodes),
  target: Math.floor(Math.random() * numNodes)
}));

const simulation = d3
  .forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id).distance(50))
  .force("charge", d3.forceManyBody().strength(-100))
  .force("center", d3.forceCenter(width / 2, height / 2));

const svg = d3
  .select("#graph-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

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

svg.call(
  d3.zoom()
    .extent([[0, 0], [width, height]])
    .scaleExtent([0.1, 4])
    .on("zoom", zoomed)
);

function zoomed(event) {
  svg.selectAll(".node").attr("transform", event.transform);
  svg.selectAll(".link").attr("transform", event.transform);
}

simulation.on("tick", () => {
  link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  node.attr("cx", d => d.x).attr("cy", d => d.y);
});
