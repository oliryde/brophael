function getMaxOfArray(numArray) {
	var temp = [];
	for (var i = numArray.length - 1; i >= 0; i--) {
		temp.push(numArray[i].index + numArray[i].higher);
	};
	return Math.max.apply(null, temp);
}
function line(x1, y1, x2, y2){
	return "M"+x1+" "+y1+"L"+x2+" "+y2+" ";
}

Raphael.fn.graphBastard = function(settings) {
	settings = settings || {};
	var data =  settings.data || [],
		width = this.width,
		height = this.height,
		margin_left = 60,
		margin_right = 60,
		margin_bottom = 60,
		margin_top = 10,
		labels = settings.labels || ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
		xaxis_y = height-margin_bottom,
		yaxis_x = margin_left;
	var xaxis_offset = width / 24;
	var xaxis_length = width - margin_left - margin_right - xaxis_offset * 2;
	var yaxis_length = height - margin_top - margin_bottom;
	var middle_xaxis_y = (yaxis_length / 2) + margin_top;
	var bar_width = xaxis_length / 11 - (xaxis_length / 30);
	var xaxis_spacing = xaxis_length / 11;
	var max = settings.max || (getMaxOfArray(data));
	var tallest_bar = max;
	var number = max;
	var i = 0;
	while(number > 100) {
		number = number / 10;
		i++;
	};
	if(((Math.floor(number)+1)*Math.pow(10, i)) - max < max*0.01) {
		number += 1;
	}
	max = 200;
	yaxis_text = [-100, -80,-60,-40,-20,0,20,40,60,80,100];

	var paper = this;
	paper.rect(margin_left, margin_top, width - margin_left - margin_right, height - margin_top - margin_bottom).attr("fill", "#FFFFFF");
	for (var i = 0; i < 11; i++) {
		y = height - margin_bottom - i * (0.1 *(height - margin_top - margin_bottom));
		if(yaxis_text[i] == 0) {
			paper.text(25, y, "Index").rotate(270);
			paper.text(width - 25, y, "Index").rotate(270);
			red_path = paper.path(line(margin_left-5, y, width-margin_right+5, y)).attr({stroke: "#FF0000", "stroke-width": "2"});
		} else {
			paper.path(line(margin_left,y,margin_left-5,y));
			paper.path(line(width-margin_right,y,width-margin_right+5,y));
			paper.path(line(margin_left,y,width- margin_right,y));
		}

		
		paper.text(width-margin_right + 10, y, Math.round(yaxis_text[i])).attr('text-anchor', 'start');
		paper.text(yaxis_x - 10, y, Math.round(yaxis_text[i])).attr('text-anchor', 'end');
	}
	for (var i = labels.length - 1; i >= 0; i--) {
		bar1_height = yaxis_length * (data[i].index/max);
		x = margin_left + xaxis_offset + (xaxis_spacing * i);
		if(bar1_height < 0) {
			paper.rect(x-bar_width / 2, middle_xaxis_y, bar_width, Math.abs(bar1_height)).attr({
				"fill": "0-#5ab85a:0-#008b00:100",
				"stroke-width": "0"});
		} else {
			paper.rect(x-bar_width / 2, middle_xaxis_y - bar1_height, bar_width, bar1_height).attr({
				"fill": "0-#f0f071:0-#8b8b00:100",
				"stroke-width": "0"});
		}
		
		console.log(bar1_height)
		paper.text(x, xaxis_y + 10, labels[i]);
		paper.text(x, xaxis_y + 22, Math.round(data[i].usage) + " kWh");
		paper.text(x, xaxis_y + 34, "Index " + Math.round(data[i].index));

		paper.path(line(x, xaxis_y, x, xaxis_y + 4));
	};
	paper.rect(margin_left, margin_top, width - margin_left - margin_right, height - margin_top - margin_bottom);

	red_path.toFront();
}