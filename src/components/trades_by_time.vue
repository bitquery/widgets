<template>
    <div>
        <errors :errors="data.errors" v-if="is_error"></errors>
        <nodata v-else-if="is_no_data"></nodata>
        <GChart type="ComboChart" :data="chartData" :options="chartOptions" v-else />
        <links obj="trades_by_time" func="trades_by_time" :exclude="['csv']" title="Trades By Time"></links>
    </div>
</template>
<script>
    export default {
        name: 'trades_by_time',
        data () {
            let theme = this.$parent.$options.context.themes[this.$parent.$options.context.theme];
            let variables = this.$parent.$options.context.query.variables;
            return {
                data: this.$parent._data,
                variables: variables,
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
                            title: this._i18n.t("title.trades"),
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
                        '1': {
                            title: this._i18n.t("title.trades"),
                            format: '#,###',
                            textStyle: {
                                color: 'green'
                            },
                            viewWindow: {
                                min: 0
                            }
                        }
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
                        '0': { color: '#9bc2cf' },
                        '1': { color: 'lightgreen' },
                        // '2': { color: 'green', type: 'line', targetAxisIndex: 1, lineWidth: 3, pointsVisible: true, pointShape: 'diamond', pointSize: 12},
                        // '3': { color: 'red', type: 'line', targetAxisIndex: 1, lineWidth: 3, pointsVisible: true, pointShape: 'diamond', pointSize: 12}
                    }
                }
            };
        },
        computed: {
            is_error: function(){
                return Array.isArray(this.data.errors) && this.data.errors.length > 0;
            },
            is_no_data: function(){
                return Array.isArray(this.data.result) && this.data.result.length < 1;
            },
            chartData: function(){
                let data_arr = [[this._i18n.t("date"), this._i18n.t("title.trades_as_buyer"), this._i18n.t("title.trades_as_seller")]];
                _.each(this.data.result, function (item) {
                    data_arr.push([(item.date.month || item.date.day), item.trades_as_buyer, item.trades_as_seller]);
                });
                return data_arr;
            }
        }
    }
</script>