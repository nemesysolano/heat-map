import {ChartUtils} from './chart-utils' ;
import {Stats} from './stats'
import {ArrayEx} from './array-ext'
/// heat-map.js

const HEATMAP_CONTAINER_PROPERTY = Symbol();
const HEATMAP_CHART_PROPERTY = Symbol();
const HEATMAP_TITLE_PROPERTY = Symbol();
const HEATMAP_LEGEND_BUTTONS_PROPERTY = Symbol();

const HEATMAP_COLORS = [
    Chart.helpers.color(ChartUtils.colors().gray).alpha(0.5).rgbString(),
    Chart.helpers.color(ChartUtils.colors().blue).alpha(0.5).rgbString(),
    Chart.helpers.color(ChartUtils.colors().green).alpha(0.5).rgbString(),
    Chart.helpers.color(ChartUtils.colors().orange).alpha(0.5).rgbString(),
    Chart.helpers.color(ChartUtils.colors().red).alpha(0.5).rgbString(),
];

export class HeatMap extends HTMLElement {

    lifetimes(values) {

        var flattened =
            values.map(
                value => {

                    var amounts = ArrayEx.rotate(value.slice(1, value.length-1), true).map(                        
                        (amount, index) => {
                            
                            return {
                                name: value[0],
                                amount: amount,
                                index: index
                            }    
                        }
                    )

                    return amounts;
                }
            ).reduce(
                (acummulator, item) => {
                    
                    item.forEach( 
                        (current, index) => {

                            if(current.amount > 0){
                                acummulator.push(current)
                            }
                        }
                    )
                    return acummulator;
                },
                []
            );
            
        
        //flattened.map( current => current.amount)        
        var average = Stats.average(flattened.map( current => current.amount));
        var selected = flattened.filter(current => current.amount > average).sort((a,b) => a.index - b.index);
        var data = selected.map(current => current.amount);
        var backgroundColor = selected.map( current => HEATMAP_COLORS[current.index]);
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
        var data = JSON.parse(element.innerText);

        return data;
    }
    createdCallback() {
        var container = document.createElement("div");
        var canvas = document.createElement("canvas");        
        var ul = document.createElement("ul");        
        var shadow = this.attachShadow({mode: 'open'});
        var ctx = canvas.getContext('2d');
        var buttons = [];
        var data = this.chartData();
        var labels = ArrayEx.rotate(data.labels.slice(1, data.labels.length-1), true);

        ul.style.listStyleType = 'none';

        container.appendChild(ul);
        container.appendChild(canvas);

        labels.forEach((value, index ) => {
            var li = document.createElement("li");
            var button = document.createElement("button");

            li.style.float = 'left';
            button.style.marginLeft = '0.5em';
            button.style.border='none';
            button.style.backgroundColor = HEATMAP_COLORS[index];
            button.innerHTML= value;
            li.appendChild(button);
            ul.appendChild(li)

            buttons.push(button)
        });

        shadow.appendChild(container);
        this[HEATMAP_CONTAINER_PROPERTY] = container;        
        this[HEATMAP_LEGEND_BUTTONS_PROPERTY] = buttons;        

                
        var lifetimes = this.lifetimes(data.values);

        var config = {
            data: {
                datasets: [lifetimes.dataset],
                labels: lifetimes.labels
            },
            options: {
                responsive: true,
                legend: {
                    position: 'right',
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


