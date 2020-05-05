<template>
    <div>
        <div class="table-responsive">
            <table :class="'table table-striped table-hover table-sm widgets-table ' + theme_class">
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
                            // sheet[_.get(item, option.path)]['metrics'] = [];
                            // sheet[_.get(item, option.path)] = {'metrics': {}};
                            _.each(option.metrics, function(metric){
                                // sheet[_.get(item, option.path)]['metrics'].push([metric.title]);
                                // sheet[_.get(item, option.path)][[metric.title]] = {};
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

                let sort = function(arr, direction = 'asc'){
                    if (direction != 'desc') {
                        arr.sort(function(a,b){
                            if (a<b) return -1;
                            if (a>b) return 1;
                            return 0;
                        });
                    } else {
                        arr.sort(function(a,b){
                            if (a>b) return -1;
                            if (a<b) return 1;
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

                let completeCols = [];
                let completeRows = [];

                _.each(rows, function(row, r_i){
                    let cRow = [];
                    _.each(cols, function(col, c_i){
                        _.each(metrics.titles, function(title, m_i){
                            if(metrics.position == 'cols'){
                                r_i == 0 && completeCols.push(_.union(col, [title]));
                                cRow.push(metrics.data[col.join('.')][row.join('.')] && metrics.data[col.join('.')][row.join('.')][title] ? metrics.data[col.join('.')][row.join('.')][title] : 0);
                            } else {
                                r_i == 0 && m_i == 0 && completeCols.push(col);
                                if(cRow[m_i] != undefined){
                                    cRow[m_i].push(metrics.data[col.join('.')][row.join('.')] && metrics.data[col.join('.')][row.join('.')][title] ? metrics.data[col.join('.')][row.join('.')][title] : 0);
                                } else {
                                    cRow[m_i] = [].concat(row, metrics.data[col.join('.')][row.join('.')] && metrics.data[col.join('.')][row.join('.')][title] ? [title, metrics.data[col.join('.')][row.join('.')][title]] : [title, 0]);
                                }
                            }
                        });
                    });
                    if(metrics.position == 'cols'){
                        completeRows.push(row.concat(cRow));
                    } else {
                        completeRows = completeRows.concat(cRow);
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

                return {cols: completeCols, rows: completeRows};
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