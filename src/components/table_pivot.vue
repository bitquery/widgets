<template>
    <div>
        <div class="table-responsive">
            {{ generatedData }}123
            <table :class="'table table-striped table-hover table-sm widgets-table ' + theme_class">
                <thead>
                <tr>
<!--                    <th v-for="(data, i) in dataOptions" :class="params(i).thClass" v-html="data.title ? data.title : ''"></th>-->
                </tr>
                </thead>
                <tbody>
<!--                <tr v-for="item in data.result">-->
<!--                    <td v-for="(data, i) in dataOptions" :class="params(i).tdClass" :style="params(i).tdStyle">-->
<!--                        <component :is="params(i).component" :item="item" :params="params(i)" :callbacks="callbacks" v-if="params(i)"></component>-->
<!--                    </td>-->
<!--                </tr>-->
                </tbody>
            </table>
        </div>
        <more-text :count="data.result.length" :load_count="100" :path="data.path"></more-text>
    </div>
</template>
<script>
    export default {
        name: 'table_pivot',
        props: ['data', 'variables', 'options', 'theme', 'context', 'componentName'],
        computed: {
            theme_class: function(){
                return this.theme.html_class
            },
            callbacks: function(){
                return this.$root.$options.context.callbacks
            },
            generatedData: function(){
                let data = this.data.result;
                let rows = [], cols = [], metrics = [];
                let doRows = this.options.rows;
                let doCols = this.options.cols;

                let getSheets = function(item, sheetsOptions){
                    let completeSheet = [];
                    let tmpSheet = [];
                    let completeMetric = [];

                    let getSheet = function(sheetsOptions){
                        _.each(sheetsOptions, function(sheet){
                            tmpSheet.push(_.get(item, sheet.path));
                            if (sheet.include){
                                tmpSheet = tmpSheet.concat(getSheet(sheet.include));
                            } else if (sheet.metrics) {
                                _.each(sheet.metrics, function(metric){
                                    completeSheet.push(tmpSheet.concat(metric.title === undefined ? _.get(item, metric.path)  : metric.title));
                                    completeMetric.push(_.get(item, metric.path));
                                });
                            } else {
                                completeSheet.push(tmpSheet)
                            }
                        });
                    };
                    getSheet(sheetsOptions);
                    return [completeSheet, completeMetric];
                };

                _.each(data, function (item) {
                    let metricsColIndexTmp = [];
                    let metricsRowIndexTmp = [];
                    let getCols = getSheets(item, doCols);
                    _.each(getCols[0], function(col, i){
                        let gcfi;
                        gcfi = _.findIndex(cols, function(e){
                            return _.isEqual(e, col);
                        });
                        if ( gcfi === -1){cols.push(col); gcfi = cols.length-1;}
                        metricsColIndexTmp.push(gcfi);
                    });

                    let getRows = getSheets(item, doRows);
                    _.each(getRows[0], function(row, i){
                        let grfi;
                        grfi = _.findIndex(rows, function(e){
                            return _.isEqual(e, row);
                        });
                        if ( grfi === -1){rows.push(row); grfi = rows.length-1;}
                        metricsRowIndexTmp.push(grfi);
                    });


                    let metricsTmp = getCols[1].length != 0 ? getCols[1] : getRows[1];

                    let metricsTmpIndex = 0;
                    _.each(metricsColIndexTmp, function (colIndex) {
                        _.each(metricsRowIndexTmp, function (rowIndex) {
                            Array.isArray(metrics[rowIndex]) ? '' : metrics[rowIndex] = [];
                            if (metrics[rowIndex][colIndex] === undefined){
                                metrics[rowIndex][colIndex] = metricsTmp[metricsTmpIndex];
                            } else {
                                metrics[rowIndex][colIndex] = metrics[rowIndex][colIndex] + metricsTmp[metricsTmpIndex]
                            }
                            metricsTmpIndex = metricsTmpIndex + 1;
                        })
                    });
                });

                let completeRows = [];
                _.each(metrics, function (metric, i){
                    let tmpMetric = [];
                    _.each(metric, function(m){
                        tmpMetric.push(m == null ? 0 : m);
                    });
                    completeRows.push(rows[i].concat(tmpMetric));
                });

                return {cols: cols, rows: completeRows}; //cols: cols, rows: rows, metrics: metrics,
            }
        },
        methods: {
            params: function(i) {
                // let data = this.dataOptions[i];
                // let parameters = {component: 'string', thClass: '', tdClass: (data.html_class ? data.html_class : ''), tdStyle: (data.style ? data.style : '')};
                // switch(data.type){
                //     case 'string-ellipsis':
                //         parameters.tdClass = 'ellipsis '+ parameters.tdClass;
                //         return _.merge(parameters, data);
                //         break;
                //     case 'string-wrap':
                //         parameters.tdClass = 'word-wrap '+ parameters.tdClass;
                //         return _.merge(parameters, data);
                //         break;
                //     case 'amount':
                //         return _.merge(parameters, {component: 'amount', thClass: 'text-right', tdClass: 'text-right '+ parameters.tdClass}, data);
                //         break;
                //     case 'count':
                //         return _.merge(parameters, {component: 'count', thClass: 'text-right', tdClass: 'text-right '+ parameters.tdClass}, data);
                //         break;
                //     case 'string':
                //     default:
                //         return _.merge(parameters, data);
                // }
            }
        }
    }
</script>