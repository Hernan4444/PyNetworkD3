$main
const radius = $radio

// A linear scale to position the nodes on the X axis
let angle = d3.scaleLinear()
    .range([0, 360])
    .domain([0, dataset.nodes.length])

const x = (angle) => radius * Math.sin(Math.PI * 2 * angle / 360);
const y = (angle) => radius * Math.cos(Math.PI * 2 * angle / 360)

let idToNode = {};
dataset.nodes.forEach(function(n, i) {
    idToNode[n.id] = n;
    actualAngle = angle(i);

    if (actualAngle < 180) {
        actualAngle -= dataset.nodes.length * 0.01
    }
    let actualX = x(actualAngle)
    let actualY = y(actualAngle)

    n.x = actualX + widthSVG / 2
    n.y = actualY + heightSVG / 2
    n.angle = actualAngle
});

dataset.links.forEach((e) => {
    e.source = idToNode[e.source];
    e.target = idToNode[e.target];
});



container
    .selectAll("text")
    .data(dataset.nodes)
    .enter()
    .append("text")
    .attr("class", "node")
    .style("font-size", `${ Math.log(360/dataset.nodes.length) * radius * 0.04}px`)
    .attr("transform", (d) => {
        let text = `translate(${d.x}, ${d.y})`;
        return text + `rotate(${((d.angle<180 ? -d.angle+90 : -d.angle-90))})`
    }).attr("text-anchor", d => d.angle < 180 ? "start" : "end")
    .attr("alignment-baseline", "middle")
    .text(d => d.id)


const curve = d3.line().curve(d3.curveBundle.beta(0.5));

const createPath = (d) => {
    let middleX = (d.source.x + d.target.x) / 2
    let middleY = (d.source.y + d.target.y) / 2

    let translatedMiddleX = (middleX + widthSVG / 2) / 2
    let translatedMiddleY = (middleY + widthSVG / 2) / 2
    let points = [
        [d.source.x, d.source.y],
        [translatedMiddleX, translatedMiddleY],
        [d.target.x, d.target.y],
    ]
    container.append('path').attr('d', curve(points))
        .attr('fill', 'none');
}
container
    .data(dataset.links)
    .enter()
    .each(createPath)