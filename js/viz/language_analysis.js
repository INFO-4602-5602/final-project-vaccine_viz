// Tooltips from https://bl.ocks.org/d3noob/257c360b3650b9f0a52dd8257d7a2d73

function load_bubbles(){
	var margin = {top: 20, right: 20, bottom: 30, left: 20},
		width = document.getElementById("language_usage").offsetWidth - margin.left - margin.right,
		height = document.getElementById("language_usage").offsetHeight - margin.top - margin.bottom;

	// set the ranges
	var x = d3.scaleBand()
			.range([0, width*0.9])
			  .padding(0.3);
	var y = d3.scaleLinear()
			.range([height, 0]);
    
    var oldSvg = d3.select('#bubbleSvg');
    oldSvg.remove();
    
    // tooltip variable
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
	// get the data
	// append a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	var svg = d3.select("#language_usage")
		.append("svg")
		.attr("transform", 
			"translate(" + margin.left + "," + margin.top + ")")
		.attr("width", width)
		.attr("height", height + margin.bottom)
        .attr("id", 'bubbleSvg');
    // Get the filename
    var filename = './resources/language_usage/';    

    switch ($('#yearSelect').val()) {
        case '2012': filename += '2012'; break;
        case '2013': filename += '2013'; break;
        case '2014': filename += '2014'; break;
        case '2015': filename += '2015'; break;
        case '2016': filename += '2016'; break;
        default: return;
    }

    switch ($('#monthSelect').val()) {
        case 'January': filename += '0101'; break;        
        case 'February': filename += '0201'; break;
        case 'March': filename += '0301'; break;
        case 'April': filename += '0401'; break;
        case 'May': filename += '0501'; break;
        case 'June': filename += '0601'; break;
        case 'July': filename += '0701'; break;
        case 'August': filename += '0801'; break;
        case 'September': filename += '0901'; break;
        case 'October': filename += '1001'; break;
        case 'November': filename += '1101'; break; 
        case 'December': filename += '1201'; break;
        default: return;
    }
    
    filename += '_';
    filename += $('#tookVaccineSelect').val();
    filename += '.tsv';

    d3.tsv(filename, function(error, data) {
		if (error) throw error;

		// Scale the range of the data in the domains
		x.domain(['Very Negative', 'Negative', 'Neutral', 'Positive', 'Very Positive']);
		y.domain([0, d3.max(data, function(d) { return parseFloat(d.value)*1.01; })]);
		// append the circles for the bubble chart
		var node = svg
            .selectAll(".node")
			.data(data)
			.enter().append("g")
			.attr("class", "node")
            .attr("transform", function(d, i) { return "translate(" + (i + 1) * 70 + ", 50)"; })
        node.append('circle')
			.attr('fill','steelblue')
			.attr("r", function(d) {return 50 * d.value; })
            .on("mouseover", function(d) {
                div.transition()
                .duration(200)
                .style("opacity", .9);
                div.html(d.word + "<br/>" + Number(Math.round(d.value+'e3')+'e-3'))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
                }
            )
            .on("mouseout", function(d) {
                div.transition()
                .duration(500)
                .style("opacity", 0);
            });       

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

function changeYear() {
    newYear = $('#yearSelect').val();
    $('#monthSelect').children().show();
    if (newYear === '2012') {
        for (var i = 0; i < 11; i++) {
            $('#monthSelect').children().eq(i).hide();
        }
        if ($('#monthSelect').val() !== 'December') $('#monthSelect').val('');
    }
    else if (newYear === '2016') {
        for (var i = 7; i < 12; i++) {
            $('#monthSelect').children().eq(i).hide();
        }
        var prevMonth = $('#monthSelect').val();
        if (prevMonth === 'August' || prevMonth === 'September' || prevMonth === 'October' || prevMonth === 'November' || prevMonth === 'December') $('#monthSelect').val('');
    }
}

function init_options() {
    // Initialize the month/year to December/2012
    for (var i = 0; i < 11; i++) {
        $('#monthSelect').children().eq(i).hide();
    }
    $('#monthSelect').val('December');
}