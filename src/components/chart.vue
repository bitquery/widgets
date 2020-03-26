<template>
    <div>
        <GChart :type="chartType" :data="chartData" :options="chartOptions" />
    </div>
</template>
<script>
    export default {
        name: 'chart',
        props: ['data', 'variables', 'options', 'theme', 'context', 'componentName'],
        data () {
            let theme = this.theme;
            return {
                chartOptions: _.merge({
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
                            title: this._i18n.t("title.calls_count"),
                            format: '#,###',
                            textStyle: {
                                color: theme.text
                            },
                            titleTextStyle: {
                                color: theme.text
                            },
                            viewWindow: {
                                min: 0
                            }
                        },
                    },
                    hAxis: {
                        title: this._i18n.t("title.month"),
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
            chartData: function(){
                let it = this;
                let options = this.options;
                let data = [];

                data.push(_.reduce(options.dataOptions, function(titles, v, k) {
                    titles.push(v.title);
                    return titles;
                }, []));

                _.each(this.data.result, function (item) {
                    data.push(_.reduce(options.dataOptions, function(datas, v, k) {
                        datas.push(v.data ? v.data : _.get(item, v.path));
                        return datas;
                    },[]));
                });
                return data;
            }
        }
    }
</script>