$main
let bidirrectional = $bidirrectional

let idToNode = {};
let matrix = {}
let max_len_words = 0

dataset.nodes.forEach(n => {
    idToNode[n.id] = n;
    matrix[n.id] = {}
    dataset.nodes.forEach((n2, j) => {
        matrix[n.id][n2.id] = 0
    })
    max_len_words = Math.max(max_len_words, String(n.id).length)
});

dataset.links.forEach((e) => {
    matrix[e.source][e.target] = 1
    if (bidirrectional) {
        matrix[e.target][e.source] = 1
    }
    e.source = idToNode[e.source];
    e.target = idToNode[e.target];
});

let x = d3.scaleBand()
    .domain(d3.range(dataset.nodes.length))
    .rangeRound([0, widthSVG])
    .paddingInner(0.1)
    .round(false)
    .align(0);


let row = container.selectAll('g.row')
    .data(Object.values(matrix))
    .enter().append('g')
    .attr('class', 'row')
    .attr('transform', function(d, i) { return `translate(0, ${x(i)})`; })

row.append('text')
    .attr('class', 'label')
    .attr('x', -4)
    .attr('y', x.bandwidth() / 2)
    .attr('dy', '0.32em')
    .style('font-size', `${x.bandwidth()}px`)
    .text((_, i) => dataset.nodes[i].id);

let maxSize = 0
document.querySelectorAll(".label").forEach(d => {
    maxSize = Math.max(d.getBBox().width, maxSize);
})

x.rangeRound([0, widthSVG - maxSize]).round(false);

container.selectAll('g.row').attr('transform', (_, i) => `translate(${maxSize}, ${x(i) + maxSize})`).each(makeRow);
container.selectAll('text.label').attr('y', x.bandwidth() / 2).style('font-size', `${x.bandwidth()}px`)

column = container.selectAll('g.column')
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
    .text((_, i) => dataset.nodes[i].id);

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