<template>
    <div>
        <GChart type="ComboChart" :data="chartData" :options="chartOptions" />
    </div>
</template>
<script>
    export default {
        name: 'transaction_by_time',
        props: ['data', 'variables', 'theme', 'context', 'componentName'],
        data () {
            let theme = this.theme;
            return {
                chartOptions: {
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
                    isStacked: true,
                    legend: {
                        position: 'top',
                        alignment: 'center',
                        maxLines: 2
                    },
                    vAxes: {
                        '0': {
                            title: this._i18n.t("title.transfers_count"),
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
                        }//,
                        // '1': {
                        //     title: this._i18n.t("title.trades"),
                        //     format: '#,###',
                        //     textStyle: {
                        //         color: 'green'
                        //     },
                        //     viewWindow: {
                        //         min: 0
                        //     }
                        // }
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
                    seriesType: 'bars',
                    series: {
                        '0': { color: '#9bc2cf', type: 'line' },
                        // '1': { color: 'lightgreen' },
                        // '2': { color: 'green', type: 'line', targetAxisIndex: 1, lineWidth: 3, pointsVisible: true, pointShape: 'diamond', pointSize: 12},
                        // '3': { color: 'red', type: 'line', targetAxisIndex: 1, lineWidth: 3, pointsVisible: true, pointShape: 'diamond', pointSize: 12}
                    }
                }
            };
        },
        computed: {
            chartData: function(){
                let data_arr = [[this._i18n.t("date"), this._i18n.t("title.transfers_count")]];
                _.each(this.data.result, function (item) {
                    data_arr.push([(item.date.month || item.date.day), item.count]);
                });
                return data_arr;
            }
        }
    }
</script>