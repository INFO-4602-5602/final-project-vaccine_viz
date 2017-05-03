function initialize_bar(){
	
}

function gender_bar_chart(){
	var margin = {top: 20, right: 20, bottom: 30, left: 60},
		width = document.getElementById("wordcloud").offsetWidth * .6 - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom;

	// set the ranges
	var x = d3.scaleBand()
			.range([0, width*0.9])
			  .padding(0.3);
	var y = d3.scaleLinear()
			.range([height, 0]);
			  
	var filename = document.getElementById('gender_bin_select').value + '.csv';
	// get the data
	// append a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	var svg = d3.select("#gender_bar")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", 
			"translate(" + margin.left + "," + margin.top + ")");
			
	d3.csv("./resources/gender/"+filename, function(error, data) {
		if (error) throw error;

		// Scale the range of the data in the domains
		x.domain(data.map(function(d) { return d.type; }));
		y.domain([d3.min(data, function(d) { return parseInt(d.number); })/2, d3.max(data, function(d) { return parseInt(d.number)*1.01; })]);

		// append the rectangles for the bar chart
		svg.selectAll(".bar")
			.data(data)
			.enter().append("rect")
			.attr('fill','steelblue')
			.attr("class", "bar")
			.attr("x", function(d) { return x(d.type); })
			.attr("width", x.bandwidth())
			.attr("y", function(d) { return y(parseInt(d.number)); })
			.attr("height", function(d) { return height - y(parseInt(d.number)); });

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

function change_bar(option_name){
	var margin = {top: 20, right: 20, bottom: 30, left: 60},
		width = document.getElementById("wordcloud").offsetWidth * .6 - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom;
	// set the ranges
	var xrange = d3.scaleBand()
		.range([0, width*0.9])
		.padding(0.3);
	var yrange = d3.scaleLinear()
		.range([height, 0]);
	var svg = d3.select("#gender_bar");
	svg.remove();
	
	var filename = option_name + '.csv';
	
	var svg = d3.select("#gender_bar_col").append('svg')
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.attr('id', 'gender_bar')
		.append("g")
		.attr("transform", 
			"translate(" + margin.left + "," + margin.top + ")");
	
	d3.csv("./resources/gender/"+filename, function(error, data) {
		if (error) throw error;
		// Scale the range of the data in the domains
		xrange.domain(data.map(function(d) { return d.type; }));
		yrange.domain([d3.min(data, function(d) { return parseInt(d.number); })/2, d3.max(data, function(d) { return parseInt(d.number)*1.01; })]);
		
		// append the rectangles for the bar chart
		svg.selectAll(".bar")
			.data(data)
			.enter()
			.append("rect")
			.attr('fill','steelblue')
			.attr("class", "bar")
			.attr("x", function(d) { return xrange(d.type); })
			.attr("width", xrange.bandwidth());
			
		var bars = svg.selectAll(".bar");
		
		bars.data(data)
		.transition()
		.duration(1000)
		.attr("y", function(d) { return yrange(parseInt(d.number)); })
		.attr("height", function(d) { return height - yrange(parseInt(d.number)); });

		// add the x Axis
		svg.append("g")
			.attr("class", "bar_x_axis")
			.attr("transform", "translate(0," + height + ")")
			.style('font-size','14')
			.call(d3.axisBottom(xrange));

		// add the y Axis
		svg.append("g")
			.attr("class", "bar_y_axis")
			.call(d3.axisLeft(yrange));
	});
}