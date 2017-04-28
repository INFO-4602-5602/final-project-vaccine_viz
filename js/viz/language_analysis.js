function initialize_language(){
	
}

function language_bubbles(){
	var margin = {top: 20, right: 20, bottom: 30, left: 60},
		width = document.getElementById("language_usage").offsetWidth * .6 - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom;

	// set the ranges
	var x = d3.scaleBand()
			.range([0, width*0.9])
			  .padding(0.3);
	var y = d3.scaleLinear()
			.range([height, 0]);
			  
	/*var filename = document.getElementById('gender_bin_select').value + '.csv';*/
	// get the data
	// append a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	var svg = d3.select("#language_usage")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", 
			"translate(" + margin.left + "," + margin.top + ")");
			
	d3.tsv("./resources/language_usage/20121101_yes.tsv", function(error, data) {
		if (error) throw error;

		// Scale the range of the data in the domains
		x.domain(data.map(function(d) { return d.type; }));
		y.domain([d3.min(data, function(d) { return parseFloat(d.value); })/2, d3.max(data, function(d) { return parseFloat(d.value)*1.01; })]);
		// append the rectangles for the bar chart
		svg.selectAll(".bar")
			.data(data)
			.enter().append("rect")
			.attr('fill','steelblue')
			.attr("class", "bar")
			.attr("x", function(d, i) {return i * 40; })
			.attr("width", 40)
			.attr("y", function(d) { return y(parseFloat(d.value)); })
			.attr("height", function(d) { return height - y(parseFloat(d.value)); });

		// add the x Axis
		svg.append("g")
			.attr("class", "bar_x_axis")
			.attr("transform", "translate(0," + height + ")")
			.style('font-size','14')
			.call(d3.axisBottom(x));

		// add the y Axis
		svg.append("g")
			.attr("class", "bar_y_axis")
			.call(d3.axisLeft(y));
	});
}