<template>
    <errors :errors="errors" obj="transfers_by_time" func="transfers_by_time" :exclude="['csv']" title="Transfers By Time" v-if="error"></errors>
    <div v-else>
        <GChart type="ComboChart" :data="chartData" :options="chartOptions" />
        <links obj="transfers_by_time" func="transfers_by_time" :exclude="['csv']" title="Transfers By Time"></links>
    </div>
</template>
<script>
    export default {
        name: 'transfers_by_time',
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
                            title: this._i18n.t("title.tx_count"),
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
                            title: this._i18n.t("title.volume", {currency: variables.currency}),
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
                        }
                    },
                    hAxis: {
                        title: this._i18n.t("title.month"),
                        textStyle: {
                            color: theme.text
                        },
                        titleTextStyle: {
                            color: theme.text
                        }
                    },
                    seriesType: 'bars',
                    series: {
                        '0': { color: 'orange' },
                        '1': { color: 'lightgreen' },
                        '2': { color: 'green', type: 'line', targetAxisIndex: 1, lineWidth: 3, pointsVisible: true, pointShape: 'diamond', pointSize: 12},
                        '3': { color: 'red', type: 'line', targetAxisIndex: 1, lineWidth: 3, pointsVisible: true, pointShape: 'diamond', pointSize: 12}
                    }
                }
            };
        },
        computed: {
            errors: function(){
                return this.$root.$options.context.query.errors
            },
            error: function(){
                return Array.isArray(this.errors) && this.errors.length > 0;
            },
            chartData: function(){
                let data_arr = [[this._i18n.t("date"), this._i18n.t("title.receive_count"), this._i18n.t("title.send_count"), this._i18n.t("title.volume_in", {currency: this.variables.currency}), this._i18n.t("title.volume_out", {currency: this.variables.currency})]];
                _.each(this.data.result, function (item) {
                    data_arr.push([(item.date.month || item.date.day), item.count_in, item.count_out, item.sum_in, item.sum_out]);
                });
                return data_arr;
            }
        }
    }
</script>