function draw(words) {
	var fill = d3.scaleOrdinal(d3.schemeCategory10);  
	d3.select("#wordcloud").append("svg")
		.attr("width", "100%")
		.attr('id', 'wordcloud_svg')
		.attr("height", 550)
		.append("g")
		.attr("transform", "translate(300,200)")
		.selectAll("text")
		.data(words)
		.enter().append("text")
		.style("font-size", function(d) { return d.size + "px"; })
		.style("font-family", "Impact")
		.style("fill", function(d, i) { return fill(i); })
		.attr("text-anchor", "middle")
		.attr("transform", function(d) {
		  return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
		})
		.text(function(d) { return d.text; });
}

function wordcloud_initialization(topic_num){
	var topicfile = 'topic'+topic_num.toString();
						
	//load data
	d3.csv('./resources/topic4viz/'+topicfile+'.csv', function(data){
		d3.layout.cloud()
		  .words(data.map(function(d) {
				return {text: d.text, size: d.size*2};
			}))
		  .rotate(function() { return ~~(Math.random() * 2) * 90; })
		  .font("Impact")
		  .fontSize(function(d) { return d.size; })
		  .on("end", draw)
		  .start();
	});
}

function update_wordcloud(button_action){
	d3.select('#wordcloud_svg').remove();
	if(button_action == 'up'){
		var num_max = document.getElementById('lda_topic_num').getAttribute('max');
		var topic = parseInt(document.getElementById('lda_topic_num').value);
		if(topic <= num_max){
			if(topic < num_max){document.getElementById('lda_topic_num').value = topic + 1;}
			wordcloud_initialization(topic-1);
		}
	}
	if(button_action == 'down'){
		var num_min = document.getElementById('lda_topic_num').getAttribute('min');
		var topic = parseInt(document.getElementById('lda_topic_num').value);
		if(topic >= num_min){
			if(topic > num_min){document.getElementById('lda_topic_num').value = topic - 1;}
			wordcloud_initialization(topic-1);
		}
	}
	if(button_action == 'clear'){
		document.getElementById('lda_topic_num').value = 1;
		wordcloud_initialization(0);
	}
}