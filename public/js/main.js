import Chart from 'chart.js';
import $ from 'jquery';

$(function () {
	var data = {
		labels: ["20:00", "20:10", "20:20", "20:30", "20:40", "20:50", "21:00","21:00", "21:10", "21:21", "21:30", "21:40", "21:50", "22:00"],
		datasets: [
		{
			label: "Total Messages per hour",
			fillColor: "rgba(67,206,245,0.1)",
			strokeColor: "rgba(67,206,245,1)",
			pointColor: "rgba(67,206,245,1)",
			pointStrokeColor: "transparent",
			pointHighlightFill: "#fff",
			pointHighlightStroke: "#282d35",
			data: [6500, 5900, 8000, 8100, 5600, 5500, 4000,6500, 5900, 8000, 8100, 5600, 5500, 4000]
		}]
	};

	Chart.types.Line.extend({
		name: "LineAlt",
		initialize: function(data){
			Chart.types.Line.prototype.initialize.apply(this, arguments);
			var xLabels = this.scale.xLabels;
			for (var i = 0; i < xLabels.length; i++)
				xLabels[i] = '';	
		}
	});
	// Get context with jQuery - using jQuery's .get() method.
	var ctx = $("#myChart").get(0).getContext("2d");
	// This will get the first returned node in the jQuery collection.
	var myNewChart = new Chart(ctx);
	var myLineChart = new Chart(ctx).LineAlt(data, {
		responsive: true,
		scaleBeginAtZero: true,
		scaleShowVerticalLines: false,
		scaleShowHorizontalLines: false,
		pointHitDetectionRadius : 40,
		datasetStrokeWidth : 4,
		pointDotRadius : 6,
		pointDotStrokeWidth : 3,
		customTooltips: function (tooltip) {
        var tooltipEl = $('.graph__tooltip');
        
        if (!tooltip) {
            tooltipEl.css({
                opacity: 0
            });
            return;
        }
        
        tooltipEl.removeClass('above below');
        tooltipEl.addClass(tooltip.yAlign); 
        // split out the label and value and make your own tooltip here
        var parts = tooltip.text.split(":");
        var label = parts[0].trim() + ':'+parts[1].trim();
        var value = parts[2].trim();
        var innerHtml = '<h3 class="graph__tooltip__header">' + value + '</h3><p class="graph__tooltip__subhead">Messages sent</p><span class="graph__tooltip__time"><b><i class="fa fa-clock-o"></i> ' + label + '</b></span>';
        tooltipEl.html(innerHtml);
        
        tooltipEl.css({
            opacity: 1,
            left: tooltip.chart.canvas.offsetLeft + tooltip.x + 'px',
            top: tooltip.chart.canvas.offsetTop + tooltip.y + 'px',
            fontSize: tooltip.fontSize,
            fontStyle: tooltip.fontStyle,
        });
    }
	});
});