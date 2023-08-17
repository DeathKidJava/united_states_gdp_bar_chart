// properties for the svg canvas
const h = 600;
const w = 1000;
const padding = 100;

// the url of the dataset
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

const svg = d3.select("svg")
              .attr("width", w)
              .attr("height", h);

// fetch data from url
const req = new XMLHttpRequest();
req.open('GET', url, true);
req.send();
req.onload = function() {
    const data = JSON.parse(req.responseText);
    const values = data['data'];
    
    // generate an array filled with the dates as date-objects
    const datesArray = values.map((value) => {
        return new Date(value[0]);
    });

    // generate an array filled with the gdp values
    const gdpArray = values.map((value) => {
        return value[1];
    });

    // generate xScale
    /* const xScale = d3.scaleLinear()
                     .domain([])
                     .range([]); */

    // generate yScale
    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(gdpArray)])
                     .range([h - padding, padding]);

    // generate timescale for x-axis
    const xAxisScale = d3.scaleTime()
                         .domain([d3.min(datesArray), d3.max(datesArray)])
                         .range([padding, w - padding]);

    // generate x-axis
    const xAxis = d3.axisBottom(xAxisScale);

    // generate y-axis
    const yAxis = d3.axisLeft(yScale);

    // append x-axis-g-element to svg canvas
    svg.append('g')
       .attr('id', 'x-axis')
       .attr('transform', 'translate(0, ' + (h - padding) + ')')
       .call(xAxis);

    // append y-axis-g-element to svg canvas
    svg.append('g')
       .attr('id', 'y-axis')
       .attr('transform', 'translate(' + padding + ', 0)')
       .call(yAxis);

    // append rect-element to svg canvas for every value
    svg.selectAll('rect')
       .data(values)
       .enter()
       .append('rect')
       .attr('class', 'bar')
       .attr('data-date', (value) => value[0])
       .attr('data-gdp', (value) => value[1])

       // set dimensions of bar
       .attr('x', (value, index) => {
        return xAxisScale(new Date(value[0]));
       })
       .attr('y', (value) => {
        return yScale(value[1]);
       })
       .attr('height', (value) => {
        return h - padding - yScale(value[1]);
       })
       .attr('width', 3)

       // show tooltip on mousehover
       .attr('onmouseenter', 'showTooltip(this)')

       // remove tooltip when mouse left the bar
       .attr('onmouseleave', 'hideTooltip(this)');
}

function showTooltip(value) {
    const tooltip = d3.select('body')
                      .append("div")
                      .attr('id', 'tooltip')
                      .attr('data-date', value.getAttribute('data-date'))
                      .attr('data-gdp', value.getAttribute('data-gdp'));
    // display quarter on tooltip 
    const date =  value.getAttribute('data-date');
    const year = date.slice(0,4);
    const quarter = Math.ceil(date.slice(5,7) / 3);         
    tooltip.append('p')
           .text(year + ' Q' + quarter);
    
    // display gdp on tooltip
    const gdpValue = value.getAttribute('data-gdp') * 1.0;
    tooltip.append('p')
           .text('$' + gdpValue + ' Billion');
    
}

function hideTooltip(value) {
    document.getElementById('tooltip').remove();
}