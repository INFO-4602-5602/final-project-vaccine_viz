function topic_dist(){
	(function(d3) {
				//var div_tmp = d3.select("#topic_dist");
				var svg = d3.select("#topic_dist"),

				margin = {top: 20, right: 20, bottom: 30, left: 50},
				width = document.getElementById("topic_dist_div").offsetWidth - margin.left - margin.right,
				height = svg.attr("height") - margin.top - margin.bottom,
				g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
				var parseTime = d3.timeParse("%Y%m%d");

				var x = d3.scaleTime().range([0, width]),
					y = d3.scaleLinear().range([height, 0]),
					color = d3.scaleOrdinal(d3.schemeCategory10);

				var line = d3.line()
					.curve(d3.curveBasis)
					.x(function(d) { return x(d.date); })
					.y(function(d) { return y(d.value);});
					
				// Define the tooltip
				var tooltip = d3.select("body").append("div")	
					.attr("class", "tooltipline")
					.style("position", "absolute")
					.style("z-index", "10")		
					.style("opacity", 0);

				d3.tsv("./resources/topic4viz/data.tsv", type, function(error, data) {
					if (error) throw error;
					var topics = data.columns.slice(1).map(function(id) {
						return {
							id: id,
							values: data.map(function(d) {
								return {date: d.date, value: d[id]};
							})
						};
					});

					x.domain(d3.extent(data, function(d) { return d.date; }));

					y.domain([
						d3.min(topics, function(c) { return d3.min(c.values, function(d) { return d.value; }); }),
						d3.max(topics, function(c) { return d3.max(c.values, function(d) { return d.value; }); })
					]);

					color.domain(topics.map(function(c) { return c.id; }));

					g.append("g")
						  .attr("class", "axis axis--x")
						  .attr("transform", "translate(0," + height + ")")
						  .call(d3.axisBottom(x));

					g.append("g")
						.attr("class", "axis axis--y")
						.call(d3.axisLeft(y))
						.append("text")
						.attr("transform", "rotate(-90)")
						.attr("y", 6)
						.attr("dy", "0.71em")
						.attr("fill", "#000")
						.text("Topic Distribution");

					var topic = g.selectAll(".topic")
						.data(topics)
						.enter().append("g")
						 .attr("class", "topic");

					topic.append("path")
						.attr("class", "line")
						.attr("d", function(d) { return line(d.values); })
						.style("stroke", function(d) {return color(d.id); })
						.on("mouseover", function(d,i) {
							tooltip.style("visibility", "visible");
							tooltip.transition().style("opacity", 1);
							
							tooltip.html("Topic Value:\t" + d.values[i].value + "<br/>"  + "Topic Selected:\t" + d.id);
						})//.on("mouseout", function(){return tooltip.style("visibility", "hidden");});
					
					var column_n = [];
					topics.map(function(c) { column_n.push(c.id); });
					
					// draw legend
					var legendRectSize = 18;
					var legendSpacing = 4;
					var legend = svg.selectAll('.legend')
						.data(column_n)
						.enter()
						.append('g')
						.attr('class', 'legend')
						.attr('transform', function(d, i) {
							var height = legendRectSize + legendSpacing;
							var offset =  height * column_n.length / 2;
							var horz = 100 + i*5 * legendRectSize;
							var vert =  height;
							if(horz < width - 50){
								return 'translate(' + horz + ',' + vert + ')';
							}else{
								return 'translate(' + (horz - width+ 130 +i * 15) + ',' + vert * (horz/width + 1.5) + ')'; //multiple rows if the exceeds width
							}
						});
					legend.append('rect')
						.attr('width', legendRectSize)
						.attr('height', legendRectSize)
						.style('fill', color)
						.style('stroke', color)
						.on('click', function(label){
							thenum = label.match(/\d+/)[0] - 1;
							
							d3.selectAll('.topic').each(function(d,i) { 
								if(thenum == i){
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
					legend.append('text')
						.attr('x', legendRectSize + legendSpacing)
						.attr('y', legendRectSize - legendSpacing)
						.style('font-family', 'Impact, Charcoal, sans-serif')
						.text(function(d) { return d.toUpperCase(); });
				  
				});

				function type(d, _, columns) {
				  d.date = parseTime(d.date);
				  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
				  return d;
				}
			})(window.d3);
}