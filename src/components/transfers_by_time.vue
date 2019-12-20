<template>
    <div>
        <GChart type="ComboChart" :data="chartData" :options="chartOptions" />
        <links obj="transfers_by_time" :link="$t('show_query')" func="transfers_by_time" title="Transfers By Time"></links>
    </div>
</template>
<script>
    export default {
        name: 'transfers_by_time',
        data () {
            return {
                data: this.$parent._data,
                variables: this.$parent.$options.context.variables,
                chartOptions: {
                    height: 400,
                    animation: {
                        duration: 700
                    },
                    isStacked: true,
                    legend: {
                        position: 'top',
                        alignment: 'center',
                        maxLines: 2
                    },
                    vAxes: {
                        '0': {
                            title: this._i18n.t("title.transactions_count"),
                            format: '#,###',
                            textStyle: {
                                color: 'black'
                            },
                            viewWindow: {
                                min: 0
                            }
                        },
                        '1': {
                            title: this._i18n.t("title.volume_eth"),
                            format: 'decimal',
                            textStyle: {
                                color: 'green'
                            },
                            viewWindow: {
                                min: 0
                            }
                        }
                    },
                    hAxis: {title: this._i18n.t("title.day")},
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
            chartData: function(){
                let data_arr = [[this._i18n.t("date"), this._i18n.t("title.receive_count"), this._i18n.t("title.send_count"), this._i18n.t("title.volume_in_eth"), this._i18n.t("title.volume_out_eth")]];
                _.each(this.$parent._data.result, function (item) {
                    data_arr.push([item.date.date, item.count_in, item.count_out, item.sum_in_eth, item.sum_out_eth]);
                });
                return data_arr;
            }
        }
    }
</script>