///chart-utils.js

const CHARUTILS_COLORS = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};
const CHARTUTILS_MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

class Months {
    static name ( index) {
        return CHARTUTILS_MONTHS[index];
    }

}


var CHARTUTILS_SEED;

export class ChartUtils {
    static colors() {
        return CHARUTILS_COLORS;        
    }
    static srand(seed) {
        CHARTUTILS_SEED = seed;
    }

    static rand(min, max) {
        var seed = CHARTUTILS_SEED;
        min = min === undefined ? 0 : min;
        max = max === undefined ? 1 : max;
        CHARTUTILS_SEED = (seed * 9301 + 49297) % 233280;
        return min + (CHARTUTILS_SEED / 233280) * (max - min);
    }

    static numbers (config) {
        var cfg = config || {};
        var min = cfg.min || 0;
        var max = cfg.max || 1;
        var from = cfg.from || [];
        var count = cfg.count || 8;
        var decimals = cfg.decimals || 8;
        var continuity = cfg.continuity || 1;
        var dfactor = Math.pow(10, decimals) || 0;
        var data = [];
        var i, value;

        for (i = 0; i < count; ++i) {
            value = (from[i] || 0) + ChartUtils.rand(min, max);
            if (ChartUtils.rand() <= continuity) {
                data.push(Math.round(dfactor * value) / dfactor);
            } else {
                data.push(null);
            }
        }

        return data;
    }

    static labels (config) {
        var cfg = config || {};
        var min = cfg.min || 0;
        var max = cfg.max || 100;
        var count = cfg.count || 8;
        var step = (max - min) / count;
        var decimals = cfg.decimals || 8;
        var dfactor = Math.pow(10, decimals) || 0;
        var prefix = cfg.prefix || '';
        var values = [];
        var i;

        for (i = min; i < max; i += step) {
            values.push(prefix + Math.round(dfactor * i) / dfactor);
        }

        return values;
    }

    static months(config) {
        var cfg = config || {};
        var count = cfg.count || 12;
        var section = cfg.section;
        var values = [];
        var i, value;

        for (i = 0; i < count; ++i) {
            value = Months[Math.ceil(i) % 12];
            values.push(value.substring(0, section));
        }

        return values;
    }

    static color(index) {
        return COLORS[index % COLORS.length];
    }

    static transparentize(color, opacity) {
        var alpha = opacity === undefined ? 0.5 : 1 - opacity;
        return Color(color).alpha(alpha).rgbString();
    }

    static randomScalingFactor () {
        return Math.round(Math.random() * 100);
    };    
}

ChartUtils.srand(Date.now());

