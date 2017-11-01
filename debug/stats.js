export class Stats {
    static average(values) {
        return values.reduce((a, v) => a + v, 0) / values.length;
    }

    static variance(values, average_) {
        var average = (function(average){

            var avg;
            if(typeof average == "undefined") {
                avg = Stats.average(values);
            } else
                avg = average;

            return avg;
        })(average_);
        var squared = values.reduce((a, v) => a + (v-average) * (v-average), 0);
        var variance = squared / (values.length - 1);
        
        return variance;
    }

    static zscores(values) { //Credits: http://mathworld.wolfram.com/z-Score.html
        var avg = Stats.average(values);
        var std = Math.sqrt(Stats.variance(values, avg));
        var zscores = values.map(x => (x - avg) / std)
        return zscores;
    }

    static aboveMean(values) {
        var avg = Stats.average(values);
        var above = values.filter(value => value > avg);
        
        return above;
    }

    static cdf(x, mean, stdev) { //Credits: https://en.wikipedia.org/wiki/Normal_distribution
        return (1 - mathjs.erf((mean - x ) / (Math.sqrt(2) * stdev))) / 2
    }
 
    
}