document.addEventListener("DOMContentLoaded", function() {
    visualizeData();

    async function fetchAsteroidData() {
        // Fetch your asteroid data here
        // For example: return await fectchDataInteractive();
    }

    function createNodes(asteroidData) {
        let nodes = [];
        // Extract asteroid data and create nodes
        // ... Code for creating nodes from asteroidData ...
        return nodes;
    }

    function createSimulation(nodes, scaleFactor, width, height) {
        // Create and return D3 simulation with forces and nodes
        const simulation = d3.forceSimulation(nodes)
            .force("charge", d3.forceManyBody().strength(-100 * scaleFactor))
            .force("center", d3.forceCenter(width / 2, height / 2));
        return simulation;
    }

    function createSVG(width, height, modelWidth, modelHeight) {
        // Create and return SVG element with appropriate dimensions and model centering
        const svg = d3
            .select("#graph-container")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("background-color", "pink");

        // Calculate translation values to center the model
        const translateX = (width - modelWidth) / 2;
        const translateY = (height - modelHeight) / 2;

        // Apply translation to the SVG group
        svg.append("g").attr("transform", `translate(${translateX}, ${translateY})`);

        return svg;
    }

    function drawLinks(svg, nodes, scaleFactor) {
        // Draw links using D3
        const link = svg
            .selectAll(".link")
            .data(nodes)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6);

        return link;
    }

    function drawNodes(svg, nodes, scaleFactor, rScale) {
        // Draw nodes with tooltips using D3
        const node = svg
            .selectAll(".node")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("stroke", "#000")
            .attr("r", d => rScale(d.size))
            .attr("fill", d => (d.isHazardous ? "#FF0000" : "#1f77b4"))
            .on("mouseover", function(d) {
                // Show tooltip on mouseover
                // Implement tooltip logic here
            })
            .on("mouseout", function() {
                // Hide tooltip on mouseout
                // Implement tooltip hiding logic here
            });

        return node;
    }

    function visualizeData() {
        fetchAsteroidData().then(asteroidData => {
            const scaleFactor = 0.5;
            const svgWidthFraction = 0.8;
            const svgHeightFraction = 0.8;
            const modelWidth = 300;
            const modelHeight = 300;

            const width = window.innerWidth * svgWidthFraction;
            const height = window.innerHeight * svgHeightFraction;

            const nodes = createNodes(asteroidData);
            const svg = createSVG(width, height, modelWidth, modelHeight);
            const simulation = createSimulation(nodes, scaleFactor, width, height);
            const rScale = createRadiusScale(nodes);

            const link = drawLinks(svg, nodes, scaleFactor);
            const node = drawNodes(svg, nodes, scaleFactor, rScale);
            
            simulation.on("tick", () => {
                link
                    .attr("x1", d => (width / 2) * scaleFactor)
                    .attr("y1", d => (height / 2) * scaleFactor)
                    .attr("x2", d => d.x * scaleFactor)
                    .attr("y2", d => d.y * scaleFactor);

                node
                    .attr("cx", d => d.x * scaleFactor)
                    .attr("cy", d => d.y * scaleFactor);
            });
        });
    }
    const separateButton = document.getElementById("separate-button");

    separateButton.addEventListener("click", function() {
        // Separate nodes into hazardous and non-hazardous groups
        const hazardousNodes = nodes.filter(node => node.isHazardous);
        const nonHazardousNodes = nodes.filter(node => !node.isHazardous);

        // Update node positions using D3 force simulation
        const combinedNodes = hazardousNodes.concat(nonHazardousNodes);

        simulation.nodes(combinedNodes).alpha(0.3).restart();

        // Update node positions based on hazardous status
        simulation.force("x", d3.forceX(width / 4).strength(0.2).initialize(combinedNodes));
        simulation.force("x", d3.forceX(3 * width / 4).strength(0.2).initialize(combinedNodes));

        // Add more forces as needed based on your layout requirements
    });
    function createRadiusScale(nodes) {
        // Create and return a scale for node radii based on asteroid sizes
        const rScale = d3.scaleSqrt()
            .domain([d3.min(nodes, d => d.size), d3.max(nodes, d => d.size)])
            .range([1, 30]);
        return rScale;
    }
});
