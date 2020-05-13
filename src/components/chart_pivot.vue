<template>
    <div>
        <GChart :type="chartType" :data="chartData" :options="chartOptions" />
    </div>
</template>
<script>
    import utils from '../lib/utils'
    export default {
        name: 'chart_pivot',
        props: ['data', 'variables', 'options', 'theme', 'context', 'componentName'],
        data () {
            let theme = this.theme;
            return {
                chartOptions: _.merge({
                    isStacked: true,
                    legendTextStyle: {
                        color: theme.text
                    },
                    backgroundColor: {
                        fill: theme.background
                    },
                    height: 400,
                    animation: {
                        duration: 400
                    },
                    isStacked: false,
                    legend: {
                        position: 'top',
                        alignment: 'center',
                        maxLines: 2
                    },
                    vAxes: {
                        '0': {
                            textStyle: {
                                color: theme.text
                            },
                            titleTextStyle: {
                                color: theme.text
                            }
                        },
                        '1': {
                            textStyle: {
                                color: theme.text
                            },
                            titleTextStyle: {
                                color: theme.text
                            }
                        }
                    },
                    hAxis: {
                        textStyle: {
                            color: theme.text
                        },
                        titleTextStyle: {
                            color: theme.text
                        },
                    },
                    seriesType: 'bars'
                }, this.options.chartOptions)
            };
        },
        computed: {
            chartSettings: function(){
                return _.merge({}, this.options.chartSettings);
            },
            chartType: function(){
                return this.options.chartType ? this.options.chartType : 'ComboChart'
            },
            generatedData: function(){
                return utils.generatedData(this);
            },
            chartData: function(){
                let it = this;
                let options = this.options;
                let data = [];

                let gdata = it.generatedData;
                let tmpCols = [];
                _.each(gdata.cols, function(col){
                    tmpCols.push(_.uniq(col).join(', '));
                });

                let tmpRows = [];
                _.each(gdata.rows, function (row) {
                    tmpRows.push([row.slice(0, gdata.titlesSize).join(', ')].concat(row.slice(gdata.titlesSize, row.length)));
                });

                data.push([tmpCols.slice(0, gdata.titlesSize).join(', ')].concat(tmpCols.slice(gdata.titlesSize, tmpCols.length)));
                data = data.concat(tmpRows);

                return data;
            }
        }
    }
</script>