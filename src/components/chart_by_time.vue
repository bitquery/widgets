<template>
    <div>
        <GChart :type="chartType" :data="chartData" :options="chartOptions" :events="chartEvents" @ready="onReady" />
{{setZoom()}}
{{setRevert()}}
    </div>
</template>
<script>
    import utils from "../lib/utils";
    import moment from "moment";

    export default {
        name: 'chart_by_time',
        props: ['data', 'variables', 'options', 'theme', 'context', 'componentName'],
        data () {
            return {};
        },
        computed: {
            chartSettings: function(){
                return _.merge({}, this.options.chartSettings);
            },
            chartType: function(){
                return this.options.chartType ? this.options.chartType : 'ComboChart'
            },
            chartEvents: function(){
                return _.merge({}, this.options.chartEvents)
            },
            chartOptions: function(){
                let theme = this.theme;

                return _.merge({
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
                }, this.options.chartOptions, this.chageOptionsDateFormat(this.context.query.variables.dateFormat))
            },
            chartData: function(){
                return this.prepareChartData(this.data.result, this.options);
            }
        },
        mounted: function(){
            this.setZoom();
            this.setRevert();
        },
        methods: {
            setRevert: function(){
                let it = this;
                if(it.$el){
                    if(!it.dRevert){
                        it.dRevert = document.createElement('div');
                        it.dRevert.innerHTML='Revert zoom';
                        it.dRevert.style.position = "absolute";
                        it.dRevert.style.zIndex = 1000;
                        it.dRevert.style.top = '10px';
                        it.dRevert.style.right = '10px';
                        it.dRevert.style.borderRadius = '0.25rem';
                        it.dRevert.style.border = it.context.theme == 'dark' ? '1px solid #758591' : '1px solid black';
                        it.dRevert.style.padding = '0 5px';
                        it.dRevert.style.cursor = 'pointer';
                        it.$el.appendChild(it.dRevert);
                        it.dRevert.addEventListener('click', function(e){
                            it.hasInnerRequest = true;
                            //                         last
                            it.context.query.request(_.first(it.historyRequests), function (data, his) {
                                it.hasInnerRequest = true;
                                // it.historyRequests.pop();
                                it.historyRequests = [];
                            });
                        });
                    }
                    if(it.hasInnerRequest === true){
                        it.hasInnerRequest = false
                    } else {
                        it.historyRequests = [];
                    }
                    if(Array.isArray(it.historyRequests) && it.historyRequests.length > 0){
                        it.dRevert.style.display = 'block';
                    } else {
                        it.dRevert.style.display = 'none';
                    }
                }
            },
            setZoom: function(){
                let it = this;
                if(it.$el && it.context.query.refresh){
                    if(!it.dFormat){
                        it.dFormat = document.createElement('div');
                        it.dFormat.innerHTML = "Time units <select>" +
                            // "<option value='%Y-%m-%dT%H'>Hours</option>" +
                            "<option value='%Y-%m-%d'>Days</option>" +
                            "<option value='%Y-%m'>Month</option>" +
                            "<option value='%Y'>Years</option>" +
                            "</select>";
                        it.dFormat.style.position = "absolute";
                        it.dFormat.style.zIndex = 1000;
                        it.dFormat.style.top = '10px';
                        it.dFormat.style.left = '10px';
                        it.$el.appendChild(it.dFormat);
                        it.dFormat.querySelector('select').addEventListener('change', function(e){
                            if (Array.isArray(it.historyRequests)){
                                it.historyRequests.push(it.context.query.variables);
                            }else{
                                it.historyRequests = [it.context.query.variables];
                            }
                            it.hasInnerRequest = true;
                            it.context.query.request({dateFormat: e.target.value}, function (data, his) {
                                it.hasInnerRequest = true;
                            });
                        });
                    }
                    it.dFormat.querySelector('select').value = it.context.query.variables.dateFormat;
                }
            },
            prepareChartData: function(result, options){
                let data = [];
                let it = this;
                data.push(_.reduce(options.dataOptions, function(titles, v, k) {
                    titles.push(v.title);
                    return titles;
                }, []));

                _.each(result, function (item) {
                    data.push(_.reduce(options.dataOptions, function(datas, v, k) {
                        if(typeof v.renderCallback === 'function'){
                            datas.push(v.renderCallback(item));
                        } else {
                            let tmp_data;
                            if (Array.isArray(v.path)){
                                _.each(v.path, function(p){
                                    tmp_data = utils.setType(_.get(item, p), v.type);
                                    return tmp_data ? false : true;
                                });
                            } else {
                                tmp_data =  utils.setType(_.get(item, v.path), v.type);
                            }

                            if(v.title && v.title.type){
                                switch(v.title.type){
                                    case 'date':
                                    case 'datetime':
                                        // ISO 8601 — 2014-12-06T10:30:00-0800
                                        // tmp_data = moment(tmp_data);
                                        tmp_data = {v: new Date(tmp_data), f: it.setPattern(tmp_data, it.context.query.variables.dateFormat)};
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
            },
            setPattern: function(date, dateFormat){
                switch(dateFormat){
                    case '%Y':
                        return moment(date).format('YYYY');
                        break;
                    case '%Y-%m':
                        return moment(date).format('MMM YYYY');
                        break;
                    case '%Y-%m-%d':
                    default:
                        return moment(date).format('MMM DD, YYYY');
                }
            },
            setTill: function(till, dateFormat){
                switch(dateFormat){
                    case '%Y':
                        return moment(till).endOf('year').format('YYYY-MM-DDTHH:mm');
                        break;
                    case '%Y-%m':
                        return moment(till).endOf('month').format('YYYY-MM-DDTHH:mm');
                        break;
                    case '%Y-%m-%d':
                    default:
                        return moment(till).endOf('day').format('YYYY-MM-DDTHH:mm');
                }
            },
            chageOptionsDateFormat: function(dateFormat){
                switch(dateFormat){
                    case '%Y':
                        return {
                            hAxis:{
                                title: 'Years',
                                format: 'yyyy',
                                gridlines: {
                                    interval: [1],
                                    units: {
                                        years: {format: ['yyyy']},
                                        // months: {format: ['MM/yy']},
                                        // days: {format: ['dd']},
                                    },
                                },
                                minorGridlines: {
                                    units: {
                                        years: {format: [' ']},
                                        months: {format: [' ']},
                                        days: {format: [' ']},
                                    },
                                    color: 'grey',
                                }
                            }
                        };
                        break;
                    case '%Y-%m-%d':
                        return {
                            hAxis:{
                                title: 'Days',
                                format: 'dd/MM/yy',
                                gridlines: {
                                    units: {
                                        years: {format: ['yyyy']},
                                        months: {format: ['MM/yy']},
                                        days: {format: ['dd']},
                                    },
                                },
                                minorGridlines: {
                                    units: {
                                        years: {format: ['yyyy']},
                                        months: {format: ['MM']},
                                        days: {format: ['dd']},
                                    },
                                    color: 'grey',
                                }
                            }
                        };
                        break;
                    case '%Y-%m-%dT%H':
                        return {
                            hAxis:{
                                title: 'Hours'
                            }
                        };
                        break;
                    case '%Y-%m':
                    default:
                        return {
                            hAxis:{
                                title: 'Months',
                                format: 'dd/MM/yy',
                                gridlines: {
                                    units: {
                                        years: {format: ['yyyy']},
                                        months: {format: ['MM/yy']},
                                        days: {format: ['dd']},
                                    },
                                },
                                minorGridlines: {
                                    units: {
                                        years: {format: ['yyyy']},
                                        months: {format: ['MM']},
                                        days: {format: ['dd']},
                                    },
                                    color: 'grey',
                                }
                            }
                        };
                }
            },
            onReady: function(chart, google, it = this){
                // let formatter = new google.visualization.DateFormat({formatType: 'short'});
                // var dat = new google.visualization.arrayToDataTable(this.chartData);
                // console.log(dat);
                // console.log(dat.toJSON());
                // formatter.format(dat, 0);
                // console.log(dat.toJSON());
                // chart.draw(dat);
                // let chart2 = new google.visualization.ChartWrapper({
                //     chartType: this.chartType,
                //     containerId: 'chart_div',
                //     options: this.chartOptions
                // });
                // let control = new google.visualization.ControlWrapper({
                //     controlType: 'ChartRangeFilter',
                //     containerId: 'control_div',
                //     options: {
                //         filterColumnIndex: 0,
                //         ui: {
                //             chartType : this.chartType,
                //             chartOptions: this.chartOptions// _.merge({}, this.chartOptions, {height: 100})
                //         }
                //     }
                // });
                //
                // var dash = new google.visualization.Dashboard(document.getElementById('dashboard'));
                // dash.bind(control, chart2);
                // dash.draw(this.chartData);
                //
                // google.visualization.events.addListener(control, 'statechange', function(e){
                //     if (!e.inProgress){
                //         console.log(e);
                //         console.log(control.getState());
                //         dash.draw(chartData);
                //     }
                // });

                // chart.bind(programmaticSlider);
                // chart.draw(this.chartData);
                // console.log(this.chartData);
                // programmaticSlider.draw(this.chartData);
                it.chart = chart;
                it.google = google;
                // console.log(chart);
                // console.log(google);
                let chartLayout = chart.getChartLayoutInterface();
                let select = document.createElement('div');
                select.style.border = "1px solid #3366cc";
                select.style.display = "none";
                select.style.position = "fixed";
                select.style.zIndex = 1000;
                select.style.backgroundColor = 'rgba(51,102,204, 0.2)';
                chart.container.parentNode.appendChild(select);
                let body = document.querySelector('body');
                let x1 = 0;
                let y1 = 0;
                let x2 = 0;
                let y2 = 0;
                let x3 = 0;
                let y3 = 0;
                let x4 = 0;
                let y4 = 0;

                function reCalc() {
                    x3 = Math.min(x1,x2);
                    x4 = Math.max(x1,x2);
                    y3 = Math.min(y1,y2);
                    y4 = Math.max(y1,y2);
                    select.style.left = x3 + 'px';
                    select.style.top = y3 + 'px';
                    select.style.width = x4 - x3 + 'px';
                    select.style.height = y4 - y3 + 'px';
                }

                function getDataPoints(areaBoungingBox, minDate, maxDate, dateFormat){
                    let dateKey = 'months';
                    switch(dateFormat){
                        case '%Y':
                            dateKey = 'years';
                            break;
                        case '%Y-%m':
                            break;
                        case '%Y-%m-%d':
                            dateKey = 'days';
                            break;
                    }
                    let numberOfRows = getNumberOfRows(minDate, maxDate, dateFormat);
                    let onePoint = areaBoungingBox.width/numberOfRows;
                    let points = [];
                    for (var row = 0; row < numberOfRows; row++){
                        let min = moment(minDate).add(row, dateKey);
                        points[row] = {left: (onePoint*row)+areaBoungingBox.left, width: onePoint, date: min, dateFormatted: min.format('YYYY-MM-DD')}
                    }
                    return points;
                }

                function getNumberOfRows(minDate, maxDate, dateFormat){
                    switch(dateFormat){
                        case '%Y':
                            return maxDate.endOf('years').diff(minDate, 'years')+1;
                            break;
                        case '%Y-%m':
                            return maxDate.endOf('months').diff(minDate, 'months')+1;
                            break;
                        case '%Y-%m-%d':
                        default:
                            return maxDate.endOf('days').diff(minDate, 'days')+1;
                    }
                }

                function selectPoints() {
                    let prepareChartData = it.prepareChartData(it.context.vm.result, it.options);
                    let xx1 = x3 - graph.getBoundingClientRect().left + parseInt(graph.getAttribute('x'));
                    let xx2 = x4 - graph.getBoundingClientRect().left + parseInt(graph.getAttribute('x'));
                    let selection = [];
                    let dataPoints = getDataPoints(
                        chartLayout.getChartAreaBoundingBox(),
                        moment(_.minBy(prepareChartData.slice(1), function(pcd){return pcd[0].v})[0].v),
                        moment(_.maxBy(prepareChartData.slice(1), function(pcd){return pcd[0].v})[0].v),
                        it.context.query.variables.dateFormat
                    );
                    for (var row = 0; row < dataPoints.length; row++) {
                        let point = dataPoints[row];
                        if ((point.left >= (xx1 - point.width)) && ((point.left + point.width) <= (xx2 + point.width))){
                            selection.push(point);
                        }
                    }
                    if(selection.length>0){
                        if (Array.isArray(it.historyRequests)){
                            it.historyRequests.push(it.context.query.variables);
                        }else{
                            it.historyRequests = [it.context.query.variables];
                        }
                        it.hasInnerRequest = true;
                        it.context.query.request({from: selection[0].date.format('YYYY-MM-DD'), till: it.setTill(selection[selection.length-1].date, it.context.query.variables.dateFormat)}, function (data, his) {
                            it.hasInnerRequest = true;
                        });
                    }
                }
                let graph;
                let flag_up = false;
                let flag_up2 = false;
                chart.container.addEventListener('mousedown', function (e) {
                    flag_up = true;
                    graph = this.querySelector('svg rect');
                    if(graph && e.clientX < graph.getBoundingClientRect().left){
                        x1 = x2 = graph.getBoundingClientRect().left;
                    } else if (graph && e.clientX > graph.getBoundingClientRect().right){
                        x1 = x2 = graph.getBoundingClientRect().right;
                    } else {
                        x1 = x2 = e.clientX;
                    }
                    y1 = graph.getBoundingClientRect().top;
                    y2 = graph.getBoundingClientRect().bottom;
                    reCalc();
                }, false);

                window.addEventListener('mousemove', function(e){
                    if(flag_up){
                        flag_up2 = true;
                        body.style.userSelect = 'none';
                        select.style.display = 'block';
                        if(graph && e.clientX < graph.getBoundingClientRect().left){
                            x2 = graph.getBoundingClientRect().left;
                        } else if (graph && e.clientX > graph.getBoundingClientRect().right){
                            x2 = graph.getBoundingClientRect().right;
                        } else {
                            x2 = e.clientX;
                        }
                        reCalc();
                    }
                }, true);

                window.addEventListener('mouseup', function (e) {
                    if(flag_up && flag_up2){
                        select.style.display = 'none';
                        body.style.userSelect = 'auto';
                        selectPoints();
                    }
                    flag_up = false;
                    flag_up2 = false;
                }, false);
            }
        }
    }
</script>