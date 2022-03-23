$main
const LINK_KWS = $link_kws;
let COLOR_NODE = "#abd9e9";

if (LINK_KWS.color_default) {
    COLOR_NODE = LINK_KWS.color_default;
}
let color = GetColorFunction(LINK_KWS, dataset, COLOR_NODE);
let bidirectional = $bidirectional

let idToNode = {};

dataset.nodes.forEach((n, i) => {
    n.index = i
    idToNode[n.id] = n;
});

dataset.links.forEach((e) => {
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
    .data(dataset.nodes)
    .enter().append('g')
    .attr('class', 'row')
    .attr('transform', function(d, i) { return `translate(0, ${x(i)})`; })

row.append('text')
    .attr('class', 'label')
    .attr('x', -4)
    .attr('y', x.bandwidth() / 2)
    .attr('dy', '0.32em')
    .attr("id", d => `row-text-${d.index}`)
    .style('font-size', `${x.bandwidth()}px`)
    .text((_, i) => dataset.nodes[i].id);

let maxSize = 0
document.querySelectorAll(".label").forEach(d => {
    maxSize = Math.max(d.getBBox().width, maxSize);
})

x.rangeRound([0, widthSVG - maxSize]).round(false);

container
    .selectAll('g.row')
    .attr('transform', (_, i) => `translate(${maxSize}, ${x(i) + maxSize})`)
    .append("rect")
    .attr("id", d => `row-${d.index}`)
    .attr('height', x.bandwidth())
    .attr('width', widthSVG - maxSize)
    .style('fill', "transparent")

container.selectAll('text.label').attr('y', x.bandwidth() / 2).style('font-size', `${x.bandwidth()}px`)

column = container.selectAll('g.column')
    .data(dataset.nodes)
    .enter().append('g')
    .attr('class', 'column')
    .attr('transform', function(d, i) { return `translate(${x(i) + maxSize}, ${maxSize})`; })

column.append("rect")
    .attr("id", d => `column-${d.index}`)
    .attr('width', x.bandwidth())
    .attr('height', heightSVG - maxSize)
    .style('fill', "transparent")

column
    .append("g")
    .attr('transform', function(d, i) { return `rotate(-90)`; })
    .append('text')
    .attr('class', 'label')
    .attr('x', 4)
    .attr('y', x.bandwidth() / 2)
    .attr('dy', '0.32em')
    .attr("id", d => `column-text-${d.index}`)
    .style('font-size', `${x.bandwidth()}px`)
    .text((_, i) => dataset.nodes[i].id);

let rowColumns = container.selectAll("rect");
let labels = container.selectAll("text");

let links = container.selectAll('g.cell')
    .data(dataset.links)
    .enter().append('g')
    .attr('class', 'cell')

links
    .append('rect')
    .attr('x', (d) => x(d.target.index) + maxSize)
    .attr('y', (d) => x(d.source.index) + maxSize)
    .attr('width', x.bandwidth())
    .attr('height', x.bandwidth())
    .attr("bi", false)
    .style('fill', color)

if (bidirectional) {
    links
        .append('rect')
        .attr('x', (d) => x(d.source.index) + maxSize)
        .attr('y', (d) => x(d.target.index) + maxSize)
        .attr('width', x.bandwidth())
        .attr('height', x.bandwidth())
        .attr("bi", true)
        .style('fill', color)

}

if (LINK_KWS.hover) {
    let linksRect = links.selectAll("rect");
    linksRect.on('mouseover', function(event, d) {
            let is_bidirectional = d3.select(this).attr("bi") == "true";
            hover(is_bidirectional, d.source.index, d.target.index);
            if (bidirectional) {
                hover(!is_bidirectional, d.target.index, d.source.index);
            }
            ShowTooltip(d, event, LINK_KWS);
        })
        .on('mouseout', function(_, _) {
            rowColumns.style("fill", "transparent").style("opacity", 1);
            labels.style("fill", "black").style("opacity", 1);
            HideTooltip(LINK_KWS);
        })
}

function hover(is_bidirectional, source, target) {
    d3.select(`#row-${source}`)
        .style("fill", LINK_KWS.hover_rect_color)
        .style("opacity", is_bidirectional ? 0.5 : 1);

    d3.select(`#column-${target}`)
        .style("fill", LINK_KWS.hover_rect_color)
        .style("opacity", is_bidirectional ? 0.5 : 1);

    d3.select(`#row-text-${source}`)
        .style("fill", LINK_KWS.hover_text_color)
        .style("opacity", is_bidirectional ? 0.5 : 1);

    d3.select(`#column-text-${target}`)
        .style("fill", LINK_KWS.hover_text_color)
        .style("opacity", is_bidirectional ? 0.5 : 1);
}