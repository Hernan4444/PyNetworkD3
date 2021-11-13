const WIDTH = $width;
const HEIGHT = $height;
const dataset = $data
const tooltipAttributes = $tooltip
const useviewBox = $view_box

const MARGIN = { TOP: 10, BOTTOM: 10, LEFT: 10, RIGHT: 10 };
const widthSVG = WIDTH - MARGIN.RIGHT - MARGIN.LEFT;
const heightSVG = HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;

const SVG = d3.select('#pynetworkd3-chart')
    .append('svg')

if (useviewBox) {
    SVG.attr("viewBox", [0, 0, WIDTH, HEIGHT])
} else {
    SVG.attr('width', WIDTH).attr('height', HEIGHT)
}

const container = SVG.append("g").attr(
    "transform",
    `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`
);