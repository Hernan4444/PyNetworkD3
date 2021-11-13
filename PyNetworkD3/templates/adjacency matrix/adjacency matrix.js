$main

const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


var graph = dataset;

var idToNode = {};
var connections = {};
var matrix = {}
let max_len_words = 5

graph.nodes.forEach(n => {
    idToNode[n.id] = n;
    matrix[n.id] = {}
    graph.nodes.forEach((n2, j) => {
        matrix[n.id][n2.id] = 0
    })
    max_len_words = Math.max(max_len_words, String(n.id).length)
});

graph.links.forEach((e) => {
    matrix[e.source][e.target] = 1
    e.source = idToNode[e.source];
    e.target = idToNode[e.target];
});

var x = d3.scaleBand()
    .rangeRound([0, widthSVG])
    .paddingInner(0.1)
    .align(0);

x.domain(d3.range(graph.nodes.length));

var row = container.selectAll('g.row')
    .data(Object.values(matrix))
    .enter().append('g')
    .attr('class', 'row')
    .attr('transform', function(d, i) { return `translate(0, ${x(i)})`; })


// alert(x.bandwidth()/10)
row.append('text')
    .attr('class', 'label')
    .attr('x', -4)
    .attr('y', x.bandwidth() / 2)
    .attr('dy', '0.32em')
    .style('font-size', `${x.bandwidth()}px`)
    .text((_, i) => graph.nodes[i].id);

let maxSize = 0
document.querySelectorAll(".label").forEach(d => {
    maxSize = Math.max(d.getBBox().width, maxSize);
})

x.rangeRound([0, widthSVG - maxSize])


container.selectAll('g.row')
    .attr('transform', function(d, i) { return `translate(${maxSize}, ${x(i) + maxSize})`; }).each(makeRow);

var column = container.selectAll('g.column')
    .data(Object.values(matrix))
    .enter().append('g')
    .attr('class', 'column')
    .attr('transform', function(d, i) { return `translate(${x(i) + maxSize}, ${maxSize})rotate(-90)`; })
    .append('text')
    .attr('class', 'label')
    .attr('x', 4)
    .attr('y', x.bandwidth() / 2)
    .attr('dy', '0.32em')
    .style('font-size', `${x.bandwidth()}px`)
    .text((_, i) => graph.nodes[i].id);

function makeRow(rowData) {
    d3.select(this).selectAll('rect')
        .data(Object.values(rowData))
        .enter().append('rect')
        .attr('x', (_, i) => x(i))
        .attr('rx', x.bandwidth() / 6)
        .attr('ry', x.bandwidth() / 6)
        .attr('width', x.bandwidth())
        .attr('height', x.bandwidth())
        .style('fill', (d) => d == 1 ? "rgb(131, 131, 131)" : "white")
}