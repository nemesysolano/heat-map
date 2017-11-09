import {ChartUtils} from './chart-utils' ;
import {Stats} from './stats'
import {ArrayEx} from './array-ext'

/**
 * Credits:
 *  Patterns and Gradients--> http://www.chartjs.org/docs/latest/general/colors.html#colors
 *  Custom Selection --> https://github.com/chartjs/Chart.js/issues/3150
 */

const HEATMAP_CONTAINER_PROPERTY = Symbol();
const HEATMAP_CHART_PROPERTY = Symbol();
const HEATMAP_TITLE_PROPERTY = Symbol();
const HEATMAP_LEGEND_BUTTONS_PROPERTY = Symbol();

const HEATMAP_COLORS = [
    Chart.helpers.color(ChartUtils.colors().blue).alpha(0.5).rgbString(),
    Chart.helpers.color(ChartUtils.colors().green).alpha(0.5).rgbString(),
    Chart.helpers.color(ChartUtils.colors().orange).alpha(0.5).rgbString(),
    Chart.helpers.color(ChartUtils.colors().red).alpha(0.5).rgbString()   
];

const NEGATIVE_COLOR = Chart.helpers.color(ChartUtils.colors().black).alpha(0.8).rgbString();
const NEGATIVE_TEXT_COLOR = Chart.helpers.color(ChartUtils.colors().white).rgbString();
const TEXT_COLOR = NEGATIVE_COLOR;
const MAX_DEFAULT = 40;

export class HeatMap extends HTMLElement {

    max(length) {
        var max = this.getAttribute('max');
        
        if(max == null)
            return Math.min(MAX_DEFAULT, length);

        max = parseInt(max);

        return Math.min(max, length);
    }

    lifetimes(rows) {
        var flattened = [];

        rows.forEach((row, index) => {
            var cells = row.slice(1, row.length-1);

            cells.forEach((amount, index) => {

                flattened.push({
                    name: row[0].substring(0,25),
                    amount: amount,
                    index: index                    
                });
            });
        });

        var max = this.max(flattened.length);
        var average = Stats.average(flattened.map( current => current.amount));
        var selected = flattened.sort((a,b) => a.index - b.index).slice(0, max);
        var data = selected.map(current => Math.abs(current.amount));
        var backgroundColor = selected.map( current => !(current.amount < 0)  ? HEATMAP_COLORS[current.index] : NEGATIVE_COLOR  );
        var labels = selected.map( current => current.name);
        
        return {
            dataset: {
                data: data,
                backgroundColor: backgroundColor
            },
            labels: labels
        };
    }

    chartData() {
        var element = document.getElementById(this.getAttribute('data'));
        var innerText = element.innerText;
        var text = innerText.replace(/"(\-?\d+(\.\d+)?)"/g,"$1")
        var data = JSON.parse(text);

        return data;
    }

    insertLegendButton(ul, value, color, textColor) {
        var li = document.createElement("li");
        var button = document.createElement("button");
    
        li.style.float = 'left';
        button.style.marginLeft = '0.5em';
        button.style.border='none';
        button.style.backgroundColor = color;
        button.style.color = textColor;
        button.innerHTML= value;
        li.appendChild(button);
        ul.appendChild(li);
        
        return button;
    }

    createdCallback() {
        var container = document.createElement("div");
        var canvas = document.createElement("canvas");        
        var ul = document.createElement("ul");        
        var shadow = this.attachShadow({mode: 'open'});
        var ctx = canvas.getContext('2d');
        var buttons = [];
        var data = this.chartData();
        var labels = data.labels.slice(1, data.labels.length-1);

        ul.style.listStyleType = 'none';

        container.appendChild(ul);
        container.appendChild(canvas);

        buttons.push(this.insertLegendButton(ul,  'Error', NEGATIVE_COLOR, "white"));
        labels.forEach((value, index ) => {
            buttons.push(this.insertLegendButton(ul, value, HEATMAP_COLORS[index], TEXT_COLOR));
        });

        shadow.appendChild(container);
        this[HEATMAP_CONTAINER_PROPERTY] = container;        
        this[HEATMAP_LEGEND_BUTTONS_PROPERTY] = buttons;        

                
        var lifetimes = this.lifetimes(data.values);

        container.style.height = '1080px';
        var config = {
            data: {
                datasets: [lifetimes.dataset],
                labels: lifetimes.labels
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: 'bottom',                    
                    display: false,
                    labels: {
                      display: false
                    }                    
                },
                title: {
                    display: true,
                    text: this.getAttribute('title')
                },
                scale: {
                  ticks: {
                    beginAtZero: true
                  },
                  reverse: false
                },
                animation: {
                    animateRotate: false,
                    animateScale: true
                }
            }
        };  

        this[HEATMAP_CHART_PROPERTY] = Chart.PolarArea(canvas, config);             
    };    

    get chart() {
        return this [HEATMAP_CHART_PROPERTY];
    }

    get legendButtons() {
        return this[HEATMAP_LEGEND_BUTTONS_PROPERTY]
    }
    get container() {
        return this[HEATMAP_CONTAINER_PROPERTY];
    }
}


