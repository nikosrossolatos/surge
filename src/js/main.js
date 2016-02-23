import $ from 'jquery';
import Graph from './graph.js';

$(function () {

	$.ajax({
		url: 'api/messages',
		type: 'get',
		data: {},
		success: function (messages) {
			var data = calculateDateRange(messages);
			var graph = new Graph(data.labels,data.data);
			graph.draw();
		}
	});
	$.ajax({
		url: 'api/channels',
		type: 'get',
		data: {},
		success: function () {
			// console.log(data);
		}
	});
	$.ajax({
		url: 'api/clients',
		type: 'get',
		data: {},
		success: function () {
			// console.log(data);
		}
	});

	function calculateDateRange(array){
		var startingDate = new Date(array[0].dateSent);
		var currentHour = startingDate.getHours();
		var currentMinute = Math.floor(startingDate.getMinutes()/10)*10;
		var data = [0];
		var labels = [currentHour+':'+currentMinute];

		currentMinute+=10;
		for (var i = 0; i < array.length; i++) {
			var messageDate = new Date(array[i].dateSent);

			if(messageDate.getHours()!=currentHour){
				currentHour = messageDate.getHours();
				currentMinute=10;
				labels.push(currentHour+':00');
				data.push(0);
			}
			else if(messageDate.getMinutes()>=currentMinute){
				labels.push(currentHour+':'+currentMinute);
				data.push(0);
				currentMinute+=10;
			}
			data[data.length-1]++;
		}
		return {labels,data};
	}
});