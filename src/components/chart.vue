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
                        let tmp_data;
                        if(typeof v.renderCallback === 'function'){
                            datas.push(v.renderCallback(item));
                        } else {
                            let tmp_data;
                            if (Array.isArray(v.path)){
                                _.each(v.path, function(p){
                                    tmp_data = _.get(item, p);
                                    return tmp_data ? false : true;
                                });
                            } else {
                                tmp_data =  _.get(item, v.path);
                            }

                            if(v.title && v.title.type){
                                switch(v.title.type){
                                    case 'date':
                                    case 'datetime':
                                        // ISO 8601 — 2014-12-06T10:30:00-0800
                                        tmp_data = new Date(tmp_data);
                                        break;
                                    case 'timeofday':
                                        // 8:30am would be: [8, 30, 0, 0]
                                        break;
                                    default:
                                        return false;
                                }
                            }

                            datas.push(v.data ? v.data.replace('%{DATA}', tmp_data) : tmp_data)
                        }
                        return datas;
                    },[]));
                });
                return data;
            }
        }
    }
</script>