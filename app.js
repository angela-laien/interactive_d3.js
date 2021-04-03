const ANTIOXIDANTS_DATA = [
    { id: 'd1', fruit: 'Blueberries', value: 9 },
    { id: 'd2', fruit: 'Rasberries', value: 4 },
    { id: 'd3', fruit: 'Plums', value: 3 },
    { id: 'd4', fruit: 'Strawberries', value: 2 },
];

const MARGINS = {top: 20, bottom: 10};
const CHART_WIDTH = 600;
const CHART_HEIGHT = 400 - MARGINS.top - MARGINS.bottom;

let selectedData = ANTIOXIDANTS_DATA;

const x = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1);
const y = d3.scaleLinear().range([CHART_HEIGHT, 0]);

const chartContainer = d3
    .select('svg')
    .attr('width', CHART_WIDTH)
    .attr('height', CHART_HEIGHT + MARGINS.top + MARGINS.bottom);

x.domain(ANTIOXIDANTS_DATA.map((d) => d.fruit)); // number of bars
y.domain([0, d3.max(ANTIOXIDANTS_DATA, (d) => d.value) + 3]);

const chart = chartContainer.append('g');

// x-axis labels
chart
    .append('g')
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .attr('transform', `translate(0, ${CHART_HEIGHT})`)
    .attr('color', '#4f009e');

    function renderChart() {
        chart
            .selectAll('bar')
            .data(selectedData, (data) => data.id)
            .enter() // find missing element
            .append('rect')
            .classed('bar', true)
            .attr('width', x.bandwidth())
            .attr('height', data => CHART_HEIGHT - y(data.value))
            .attr('x', (data) => x(data.fruit))
            .attr('y', (data) => y(data.value));
        
        chart
            .selectAll('bar')
            .data(selectedData, (data) => data.id)
            .exit()
            .remove();

        // bar value labels
        chart
            .selectAll('.label')
            .data(selectedData, (data) => data.id)
            .enter()
            .append('text')
            .text((data) => data.value)
            .attr('x', data => x(data.fruit) + x.bandwidth()/2) // try to move label to the middle step 1
            .attr('y', data => y(data.value) -20)
            .attr('text-anchor', 'middle') // move text label to the middle of the bar step 2
            classed('label', true);
        
        chart
            .selectAll('.label')
            .data(selectedData, (data) => data.id)
            .exit()
            .remove();
    }

renderChart();

let unselectedIds = [];


const listItems = d3
    .select('#data')
    .select('ul')
    .selectAll('li')
    .data(ANTIOXIDANTS_DATA)
    .enter()
    .append('li');

listItems.append('span').text(data => data.fruit);

listItems
    .append('input')
    .attr('type', 'checkbox')
    .attr('checked', true)
    .on('change', (data) => {
        if (unselectedIds.indexOf(data.id) === -1) {
            unselectedIds.push(data.id);
        } else {
            unselectedIds = unselectedIds.filter(id => id !== data.id);
        }
        selectedData = ANTIOXIDANTS_DATA.filter(
            (d) => unselectedIds.indexOf(d.id) === -1
        );
        renderChart();
    });