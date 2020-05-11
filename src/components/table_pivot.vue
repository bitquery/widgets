<template>
    <div>
        <div class="table-responsive">
            <table :class="'tab12312 table table-striped table-hover table-sm widgets-table ' + theme_class">
                <thead>
                <tr v-for="(item, i) in generatedData.cols[0]">
                    <th v-for="col in generatedData.cols">{{col[i]}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="row in generatedData.rows">
                    <td v-for="item in row">
                        {{ item }}
                    </td>
                </tr>
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
    import utils from '../lib/utils'

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
                let doRows = this.options.rows;
                let doCols = this.options.cols;
                let limitOptions = this.options.limit;
                let sortOptions = this.options.sort;
                let titles = [''];
                let dimensions = {cols: {}, rows: {}, sort: {cols: [], rows: []}};
                let metrics = {position: '', titles: [], data: {}};

                let getSheet = function(item, sheetOptions){
                    let sheet = {};
                    let metrics = {};
                    let titles = [];
                    let sort = [];
                    let path = '';
                    _.each(sheetOptions, function (option){
                        sheet[_.get(item, option.path)] = {};
                        path = _.get(item, option.path);
                        titles.push(option.title);
                        sort.push(option.sort != undefined ? option.sort : 'asc');
                        if (option.include){
                            sheet[_.get(item, option.path)] = getSheet(item, option.include).sheet;
                            path = path + '.' + getSheet(item, option.include).path;
                            metrics = getSheet(item, option.include).metrics;
                            titles = titles.concat(getSheet(item, option.include).titles);
                            sort = sort.concat(getSheet(item, option.include).sort);
                        } else if (option.metrics){
                            _.each(option.metrics, function(metric){
                                metrics[metric.title] = _.get(item, metric.path);
                            });
                        } else {
                        }
                    });
                    return {sheet: sheet, metrics: metrics, path: path, titles: titles, sort: sort};
                };

                _.each(data, function (item) {
                    let getCols = getSheet(item, doCols);
                    let getRows = getSheet(item, doRows);

                    _.merge(dimensions.cols, getCols.sheet);
                    _.merge(dimensions.rows, getRows.sheet);

                    dimensions.sort.cols = getCols.sort;
                    dimensions.sort.rows = getRows.sort;
                    metrics.data[getCols.path] === undefined ? metrics.data[getCols.path] = {} : '';

                    if (Object.keys(getCols.metrics).length != 0){
                        titles = getRows.titles;
                        metrics.position = 'cols';
                        metrics.titles = _.union(metrics.titles, Object.keys(getCols.metrics));
                        _.each(getCols.metrics, function (value, key) {
                            metrics.data[getCols.path][getRows.path] === undefined ? metrics.data[getCols.path][getRows.path] = {} : '';
                            metrics.data[getCols.path][getRows.path][key] = metrics.data[getCols.path][getRows.path][key] == undefined ? value : metrics.data[getCols.path][getRows.path][key] + value;
                        });
                    }else{
                        titles = getRows.titles.concat(['']);
                        metrics.position = 'rows';
                        metrics.titles = _.union(metrics.titles, Object.keys(getRows.metrics));
                        _.each(getRows.metrics, function (value, key) {
                            metrics.data[getCols.path][getRows.path] === undefined ? metrics.data[getCols.path][getRows.path] = {} : '';
                            metrics.data[getCols.path][getRows.path][key] = metrics.data[getCols.path][getRows.path][key] == undefined ? value : metrics.data[getCols.path][getRows.path][key] + value;
                        });
                    }

                });
                console.log('dimensions');
                console.log(dimensions);
                console.log('metrics');
                console.log(metrics);
                console.log('titles');
                console.log(titles);

                let sort = function(arr, direction = 'asc', c = undefined){
                    if (direction != 'desc') {
                        arr.sort(function(a,b){
                            let aa = c == undefined ? a : a[c];
                            let bb = c == undefined ? b : b[c];
                            if (aa<bb) return -1;
                            if (aa>bb) return 1;
                            return 0;
                        });
                    } else {
                        arr.sort(function(a,b){
                            let aa = c == undefined ? a : a[c];
                            let bb = c == undefined ? b : b[c];
                            if (aa>bb) return -1;
                            if (aa<bb) return 1;
                            return 0;
                        })
                    }
                    return arr;
                };

                let completeDimensions = function(dimensions, sortDirections, dimkeys = []){
                    let complete = [];
                    let k = [].concat(dimkeys);
                    let keys = Object.keys(dimensions);
                    keys = sort(keys, sortDirections);
                    sortDirections.shift();
                    _.each(keys, function(key){
                        if (Object.keys(dimensions[key]).length > 0){
                            complete = complete.concat(completeDimensions(dimensions[key], sortDirections, k.concat([key])));
                        } else {
                            complete.push(k.concat([key]));
                        }
                    });
                    return complete;
                };

                let cols = completeDimensions(dimensions.cols, dimensions.sort.cols);
                let rows = completeDimensions(dimensions.rows, dimensions.sort.rows);
                console.log('cols');
                console.log(cols);
                console.log('rows');
                console.log(rows);

                if(sortOptions && sortOptions.axis == 'col'){
                    _.each(cols, function(col){
                        let sum = 0;
                        _.each(metrics.data, function(col_value, col_key){
                            _.each(col_value, function(row_value, row_key){
                                if(col_key == col.join('.')){
                                    sum = sum + row_value[sortOptions.metric];
                                }
                            });
                        });
                        col.push(sum);
                    });
                    cols = sort(cols, sortOptions.direction, cols[0].length-1);
                    _.each(cols, function(col){
                        col.pop();
                    });
                }else if(sortOptions && sortOptions.axis == 'row'){
                    _.each(rows, function(row){
                        let sum = 0;
                        _.each(metrics.data, function(col_value, col_key){
                            _.each(col_value, function(row_value, row_key){
                                if(row_key == row.join('.')){
                                    sum = sum + row_value[sortOptions.metric];
                                }
                            });
                        });
                        row.push(sum);
                    });
                    rows = sort(rows, sortOptions.direction, rows[0].length-1);
                    _.each(rows, function(row){
                        row.pop();
                    });
                }

                let completeCols = [];
                let completeRows = [];

                _.each(rows, function(row, r_i){
                    if (limitOptions && limitOptions.length && r_i >= limitOptions.length && limitOptions.axis == 'row' && limitOptions.other != true){
                        return undefined;
                    }
                    let cRow = [];
                    _.each(cols, function(col, c_i){
                        if (limitOptions && limitOptions.length && c_i >= limitOptions.length && limitOptions.axis == 'col' && limitOptions.other != true){
                            return undefined;
                        }
                        _.each(metrics.titles, function(title, m_i){
                            if(metrics.position == 'cols'){
                                if (limitOptions && limitOptions.length != undefined && c_i >= limitOptions.length && limitOptions.axis == 'col') {
                                    let other = Array(col.length).fill('Other');
                                    if (completeCols[completeCols.length - metrics.titles.length] && completeCols[completeCols.length - metrics.titles.length][0] == 'Other') {
                                        cRow[completeCols.length - metrics.titles.length + m_i] = (cRow[completeCols.length - metrics.titles.length + m_i] || 0) + (metrics.data[col.join('.')][row.join('.')] && metrics.data[col.join('.')][row.join('.')][title] ? metrics.data[col.join('.')][row.join('.')][title] : 0);
                                    } else {
                                        r_i == 0 && completeCols.push(other.concat([title]));
                                        cRow.push(metrics.data[col.join('.')][row.join('.')] && metrics.data[col.join('.')][row.join('.')][title] ? metrics.data[col.join('.')][row.join('.')][title] : 0);
                                    }
                                }else{
                                    r_i == 0 && completeCols.push(_.union(col, [title]));
                                    cRow.push(metrics.data[col.join('.')][row.join('.')] && metrics.data[col.join('.')][row.join('.')][title] ? metrics.data[col.join('.')][row.join('.')][title] : 0);
                                }
                            } else {
                                if (limitOptions && limitOptions.length != undefined && c_i >= limitOptions.length && limitOptions.axis == 'col') {
                                    let other = Array(col.length).fill('Other');
                                    if (completeCols[completeCols.length - 1] && completeCols[completeCols.length - 1][0] == 'Other') {
                                        if(cRow[m_i] != undefined){
                                            cRow[m_i][completeCols.length + row.length] = (cRow[m_i][completeCols.length + row.length] || 0) + (metrics.data[col.join('.')][row.join('.')] && metrics.data[col.join('.')][row.join('.')][title] ? metrics.data[col.join('.')][row.join('.')][title] : 0);
                                        } else {
                                            cRow[m_i] = [].concat(row, metrics.data[col.join('.')][row.join('.')] && metrics.data[col.join('.')][row.join('.')][title] ? [title, metrics.data[col.join('.')][row.join('.')][title]] : [title, 0]);
                                        }
                                    }else{
                                        r_i == 0 && m_i == 0 && completeCols.push(other);
                                        if(cRow[m_i] != undefined){
                                            cRow[m_i].push(metrics.data[col.join('.')][row.join('.')] && metrics.data[col.join('.')][row.join('.')][title] ? metrics.data[col.join('.')][row.join('.')][title] : 0);
                                        } else {
                                            cRow[m_i] = [].concat(row, metrics.data[col.join('.')][row.join('.')] && metrics.data[col.join('.')][row.join('.')][title] ? [title, metrics.data[col.join('.')][row.join('.')][title]] : [title, 0]);
                                        }
                                    }
                                } else {
                                    r_i == 0 && m_i == 0 && completeCols.push(col);
                                    if(cRow[m_i] != undefined){
                                        cRow[m_i].push(metrics.data[col.join('.')][row.join('.')] && metrics.data[col.join('.')][row.join('.')][title] ? metrics.data[col.join('.')][row.join('.')][title] : 0);
                                    } else {
                                        cRow[m_i] = [].concat(row, metrics.data[col.join('.')][row.join('.')] && metrics.data[col.join('.')][row.join('.')][title] ? [title, metrics.data[col.join('.')][row.join('.')][title]] : [title, 0]);
                                    }
                                }
                            }
                        });
                    });
                    if(metrics.position == 'cols'){
                        if(limitOptions && limitOptions.length != undefined && r_i >= limitOptions.length && limitOptions.axis == 'row'){
                            let other = Array(row.length).fill('Other');
                            if (completeRows[completeRows.length - 1] && completeRows[completeRows.length - 1][0] == 'Other') {
                                _.each(cRow, function(cR, r_i){
                                    completeRows[completeRows.length - 1][row.length+r_i] = completeRows[completeRows.length - 1][row.length+r_i] + cR;
                                });
                            } else {
                                completeRows.push(other.concat(cRow));
                            }
                        } else {
                            completeRows.push(row.concat(cRow));
                        }
                    } else {
                        if(limitOptions && limitOptions.length != undefined && r_i >= limitOptions.length && limitOptions.axis == 'row'){
                            let other = Array(row.length).fill('Other');
                            if (completeRows[completeRows.length - metrics.titles.length] && completeRows[completeRows.length - metrics.titles.length][0] == 'Other') {
                                _.each(cRow, function (cr, cr_i){
                                    _.each(cr, function(r, i){
                                        if(row.length >= i){return undefined;}
                                        completeRows[completeRows.length - metrics.titles.length + cr_i][i] = (completeRows[completeRows.length - metrics.titles.length + cr_i][i] || 0) + r;
                                    });
                                });
                            } else {
                                _.each(cRow,function(cr){
                                    completeRows.push(other.concat(cr.slice(row.length, cr.length)));
                                });
                            }
                        }else{
                            completeRows = completeRows.concat(cRow);
                        }
                    }
                });

                let titlesComplete = [];
                _.each(titles, function (title) {
                    titlesComplete.push(Array(completeCols[0].length).fill(title))
                });

                completeCols = titlesComplete.concat(completeCols);

                console.log('titlesComplete');
                console.log(titlesComplete);

                console.log('completeCols');
                console.log(completeCols);
                console.log('completeRows');
                console.log(completeRows);

                return {cols: completeCols, rows: completeRows, titlesSize: titles.length};
            }
        },
        mounted: function(){
            // console.log(this);
            this.theadSpan();
            this.tbodySpan();
        },
        methods: {
            theadSpan: function(){
                let trs = this.$el.querySelectorAll('table thead tr');
                let trTmp=[];
                _.each(trs, function(tr){
                    let ths = tr.querySelectorAll('th');
                    let thTmp;
                    _.each(ths, function (th, th_i) {
                        if (!thTmp || thTmp && thTmp.innerText != th.innerText){
                            thTmp = th;
                            thTmp.setAttribute('colspan', 1);
                            th.style.display = 'table-cell';
                        } else {
                            thTmp.setAttribute('colspan', parseInt(thTmp.getAttribute('colspan'))+1);
                            th.style.display = 'none';
                        }
                    });
                });

                _.each(trs, function (tr) {
                    let ths = tr.querySelectorAll('th');
                    if(trTmp.length == 0){
                        _.each(ths, function (th) {
                            th.setAttribute('rowspan', 1);
                            trTmp.push(th);
                        });
                        return undefined;
                    }
                    _.each(ths, function (th, th_i) {
                        if(th.innerText != trTmp[th_i].innerText){
                            trTmp[th_i] = th;
                            trTmp[th_i].setAttribute('rowspan', 1);
                        } else {
                            trTmp[th_i].setAttribute('rowspan', parseInt(trTmp[th_i].getAttribute('rowspan'))+1);
                            th.style.display = 'none';
                        }
                    });
                })
            },
            tbodySpan: function(){
                let titlesSize = this.generatedData.titlesSize;
                console.log(titlesSize);
                let trs = this.$el.querySelectorAll('table tbody tr');
                let trTmp=[];
                _.each(trs, function(tr){
                    let tds = Array.from(tr.querySelectorAll('td')).slice(0, titlesSize);
                    let tdTmp;
                    _.each(tds, function (td, td_i) {
                        if (!tdTmp || tdTmp && tdTmp.innerText != td.innerText){
                            tdTmp = td;
                            tdTmp.setAttribute('colspan', 1);
                            td.style.display = 'table-cell';
                        } else {
                            tdTmp.setAttribute('colspan', parseInt(tdTmp.getAttribute('colspan'))+1);
                            td.style.display = 'none';
                        }
                    });
                });

                _.each(trs, function (tr) {
                    let tds = Array.from(tr.querySelectorAll('td')).slice(0, titlesSize);
                    if(trTmp.length == 0){
                        _.each(tds, function (td) {
                            td.setAttribute('rowspan', 1);
                            trTmp.push(td);
                        });
                        return undefined;
                    }
                    _.each(tds, function (td, td_i) {
                        if(td.innerText != trTmp[td_i].innerText){
                            trTmp[td_i] = td;
                            trTmp[td_i].setAttribute('rowspan', 1);
                        } else {
                            trTmp[td_i].setAttribute('rowspan', parseInt(trTmp[td_i].getAttribute('rowspan'))+1);
                            td.style.display = 'none';
                        }
                    });
                })
            },
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