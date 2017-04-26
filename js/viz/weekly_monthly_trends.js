//Reference: http://stackoverflow.com/questions/34886070/multiseries-line-chart-with-mouseover-tooltip
//Pin the width and height to the .chart_wm_trends div
var margin = {
        top: 20,
        right: 80,
        bottom: 50,
        left: 50
    },
    width = $(".chart_wm_trends").width() - margin.left - margin.right,
    height = $(".chart_wm_trends").height() - margin.top - margin.bottom;

var parseDate = d3.timeParse("%Y%m%d");

var x = d3.scaleTime().range([0, width]);

var y = d3.scaleLinear().range([height, 0]);

//Color exists as a Scale. 
var color = d3.scaleOrdinal(d3.schemeCategory10);

var xAxis = d3.axisBottom(x);

var yAxis = d3.axisLeft(y);

//The line function draws points for a path based on the date and 'value' for each row in each series. 
var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) {
        return x(d.date);
    })
    .y(function(d) {
        return y(d.rate);
    });

var svg = d3.select(".chart_wm_trends").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//This is a dictionary object we'll use to get plain language labels.
//Our data comes with the values on the left. We use a key to get the corresponding value:
//Ex.: `labels["CLMUR"]` => "Columbia, Mo."
var labels = {
  "yes" : "Intention/Receipt",
  "no" : "Other Mentions",
}



d3.tsv("./resources/trends/count_monthly.tsv", function(error, data) {
    if (error) throw error;

    var colorDomain = d3.keys(
            data[0]).filter(
            function(key) {
                return key !== "date";
            }
        )
        //pass that to our color scale
    color.domain(colorDomain);

    //Create new property called "date" for each row.
    //assign it the value of d.date after it's been formatted. 
    data.forEach(function(d) {
        d.date = parseDate(d.date);
    });

    //color.domain is an array of our column headers (but not "date")
    //It's the the values we'll be charting.
    //colorDomain is an array of 3 values, which are our column headers. 
    var places = color.domain().map(function(name) {
        return {
            name: name,
            values: data.map(function(d) {
                return {
                    date: d.date,
                    rate: +d[name],
                    name : labels[name]
                };
            })
        };
    });
	
    x.domain(d3.extent(data, function(d) {
        return d.date;
    }));

    y.domain([
        /*d3.min(places, function(c) { 
        return d3.min(c.values, function(v) { 
            return v.rate; 
            }); 
        }),*/
        0,
        d3.max(places, function(c) {
            return d3.max(c.values, function(v) {
                return v.rate;
            });
        })
    ]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("transform", "translate(0,0)")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Unemployment Rate");

    var trend_line = svg.selectAll(".trend_line")
        .data(places)
        .enter().append("g")
        .attr("class", "trend_line")
		.attr('id', function(d){
			return "trend_line_" + d.name;
		});

    trend_line.append("path")
        .attr("class", "line")
        .attr("d", function(d) {
            return line(d.values);
        })
        .style("stroke", function(d) {
            return color(d.name);
        });

    /* --------------- */
    /* This is the tooltip logic. */
    // For each value in our data, we're adding a dot to the page.
    // In our css, we'll set the .dot to opacity : 0, which makes it invisible.
    // It is, however, still something we can mouseover.
    // So each line has an invisible chain of dots representing each value.
    // When we mouseover it, we'll do 4 things:
    // 1) Make the dot visible.
    // 2) Get the date, place name, and rate for that data point
    // 3) Append those values to the tooltip.
    // 4) Show the tooltip.
    
    // We'll also use a `mousemove` listener to position our dots.
    // And a `mouseout` listener to hide the tooltip and the dot.

    trend_line.selectAll(".dot")
        .data(function(d) {
          //So we'll use it to draw our dots. The value for each array of dots
          //will be the array of values attached to each line:
            return d.values;
        })
        .enter().append("circle") //Add a new circle for each data point in the array.
        .attr("class", "dot")
        .attr("cx", function(d) {
            return x(d.date); //Position accordingly.
        })
        .attr("cy", function(d) {
            return y(d.rate); //Position accordingly.
        })
        .attr("r", 5)
        .on("mouseover", function(d) {

            //We're using the Moment.js library to get a month and year for our tooltip.
            //We're using Moment.js because our dates are in the js date format.
            var displayDate = moment(d.date).format("MMM. YYYY");
            var displayVal = d.rate+" tweets";

            //Append the values to the tooltip with some markup.
            $(".tt").html(
              "<div class='name'>"+d.name+"</div>"+
              "<div class='date'>"+displayDate+": </div>"+
              "<div class='rate'>"+displayVal+"</div>"
            )

            //Show the tooltip.
            $(".tt").show();

            //Make the dot visible.
            d3.select(this).style("opacity", 1);
            
        })
        .on("mousemove", function(d) {

            //Get the mouse position relative to the .chart_wm_trends div.
            //Add the margin.left and margin.top values to make the div set properly in the .chart_wm_trends.
            //Add 10px to each so the tooltip is offset appropriately.
            var xPos = d3.mouse(this)[0] + margin.left + 10;
            var yPos = d3.mouse(this)[1] + margin.top + 10;

            //Use jQuery to position the .tt div with the .chart_wm_trends div.
            //See the CSS for important style info here. 
            $(".tt").css({
                "left": xPos + "px",
                "top": yPos + "px"
            })

        })
        .on("mouseout", function(d) {
            //Turn this dot's opacity back to 0
            //And hide the tooltip.
            d3.select(this).style("opacity", 0);
            $(".tt").hide();
        })

    // draw legend
	var legendRectSize = 18;
	var legendSpacing = 4;
	var legend = svg.selectAll('.legend')
		.data(colorDomain)
		.enter()
		.append('g')
		.attr('class', 'legend')
		.attr('transform', function(d, i) {
			var height = legendRectSize + legendSpacing;
			var offset =  height * colorDomain.length / 2;
			var horz = 100 + i* 10 * legendRectSize;
			var vert =  height;
			return 'translate(' + horz + ',' + vert + ')';
		}).on('click', function(label){
			d3.select('#trend_line_'+ label).each(function(d,i) { 
				if(label == d.name){
					if(d3.select(this).attr('display') == 'none'){
						d3.select(this).attr('display','inline');
					}else{
						d3.select(this).attr('display','none');
					}
				}
			});
			if(d3.select(this).attr('class') == 'disabled'){
				d3.select(this).attr('class', '');
			}else{
				d3.select(this).attr('class', 'disabled');
			}
		});
	
	legend.append('rect')
		.attr('width', legendRectSize)
		.attr('height', legendRectSize)
		.style('fill', color)
		.style('stroke', color);
	legend.append('text')
		.attr('x', legendRectSize + legendSpacing)
		.attr('y', legendRectSize - legendSpacing)
		.style('font-family', 'Impact, Charcoal, sans-serif')
		.text(function(d) { return labels[d]; });
});