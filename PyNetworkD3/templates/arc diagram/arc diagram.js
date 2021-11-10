const borders = true;
const WIDTH = $width;
const HEIGHT = $height;
const dataset = $data
const tooltipAttributes = $tooltip
const MAX_RADIUS = $radio;

const MARGIN = { TOP: 10, BOTTOM: 10, LEFT: 10, RIGHT: 10 };
const widthSVG = WIDTH - MARGIN.RIGHT - MARGIN.LEFT;
const heightSVG = HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;

const SVG = d3.select('#pynetworkd3-chart')
    .append('svg')

    .attr('width', WIDTH)
    .attr('height', HEIGHT)
    // .attr("viewBox", [0, 0, WIDTH, HEIGHT])


const container = SVG.append("g").attr(
    "transform",
    `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`
);


// A linear scale to position the nodes on the X axis
let x = d3.scalePoint()
    .range([0, widthSVG])
    .domain(dataset.nodes.map((d) => d.id))

let idToNode = {};
dataset.nodes.forEach(function (n) {
    idToNode[n.id] = n;
});

let links = container
    .selectAll('mylinks')
    .data(dataset.links)
    .enter()
    .append('path')
    .attr('d', function (d) {
        start = x(idToNode[d.source].id)    // X position of start node on the X axis
        end = x(idToNode[d.target].id)      // X position of end node
        return ['M', start, heightSVG - 30,    // the arc starts at the coordinate x=start, y=heightSVG-30 (where the starting node is)
            'A',                            // This means we're gonna build an elliptical arc
            (start - end) / 2, ',',    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
            (start - end) / 2, 0, 0, ',',
            start < end ? 1 : 0, end, ',', heightSVG - 30] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
            .join(' ');
    })
    .style("fill", "none")
    .attr("stroke", "black")
    .style('stroke-width', '0.3')

let nodes = container
    .selectAll("mynodes")
    .data(dataset.nodes)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return (x(d.id)) })
    .attr("cy", heightSVG - 30)
    .attr("r", MAX_RADIUS)
    .style("fill", "#69b3a2")

// // And give them a label
// container
//     .selectAll("mylabels")
//     .data(dataset.nodes)
//     .enter()
//     .append("text")
//     .attr("x", function (d) { return (x(d.id)) })
//     .attr("y", heightSVG - 5)
//     .text(function (d) { return (d.id) })
//     .style("text-anchor", "middle")


nodes
    .on('mouseover', function (_, d) {
        nodes.style('fill', "#B8B8B8")
        d3.select(this).style('fill', '#69b3b2')
        links
            .style('stroke', (link_d) => link_d.source === d.id || link_d.target === d.id ? '#69b3b2' : '#b8b8b8')
            .style('stroke-width', (link_d) => link_d.source === d.id || link_d.target === d.id ? 2 : 0.3)
    })
    .on('mouseout', function (d) {
        nodes.style('fill', "#69b3a2")
        links
            .style('stroke', 'black')
            .style('stroke-width', '0.3')
    })