function delimeter(number, p = {}){ // object p (delimiter, separator, precision)
    let num, pre;

    if (!p.delimiter) {p.delimiter  = ',';}
    if (!p.separator) {p.separator = '.';}
    if (!p.precision) {p.precision = 6;}

    let numarr = parseFloat(number).toFixed(p.precision).split('.');
    num = numarr[0];
    pre = numarr[1];
    for (var i=num.length-3;i > 0 ;i=i-3) {
        num=num.slice(0,i)+p.delimiter.toString()+num.slice(i);
    }

    return num+p.separator+pre;
}

function select(selector){
    let selectorType = 'querySelectorAll';

    let obj = {
        selector: selector,
        elements: document[selectorType](selector),
        addClass: function(classname){
            _.each(this.elements, function (element) {
                element.classList.add(classname);
            });
            return this;
        },
        removeClass: function(classname){
            _.each(this.elements, function (element) {
                element.classList.remove(classname);
            });
            return this;
        }
    }

    return obj;
};

function widgetsPluginLoader(obj, url){
    // If already included in the page:
    if (window[obj]) {
        return Promise.resolve(window[obj])
    }
    if (!window[obj+'LoaderPromise']) {
        window[obj+'LoaderPromise'] = new Promise(resolve => {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.onload = () => resolve(window[obj]);
            script.src = url;
            document.body.appendChild(script)
        })
    }
    return window[obj+'LoaderPromise']
};

function generatedData(it){
    let data = it.data.result;
    let doRows = it.options.rows;
    let doCols = it.options.cols;
    let limitOptions = it.options.limit;
    let sortOptions = it.options.sort;
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
            let get_option_path;
            if (Array.isArray(option.path)){
                _.each(option.path, function(path){
                    get_option_path = _.get(item, path, null);
                    return get_option_path != null ? false : true;
                });
            } else {
                get_option_path = _.get(item, option.path);
            }
            sheet[get_option_path] = {};
            path = get_option_path;
            titles.push(option.title);
            sort.push(option.sort != undefined ? option.sort : 'asc');
            if (option.include){
                sheet[get_option_path] = getSheet(item, option.include).sheet;
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
    // console.log('dimensions');
    // console.log(dimensions);
    // console.log('metrics');
    // console.log(metrics);
    // console.log('titles');
    // console.log(titles);

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
    // console.log('cols');
    // console.log(cols);
    // console.log('rows');
    // console.log(rows);

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

    if(titlesComplete[0] && titlesComplete[0][0] == undefined){
        titlesComplete.shift();
        _.each(completeRows, function(cr){
            cr.shift();
        });
    }

    completeCols = titlesComplete.concat(completeCols);

    if(Object.keys(dimensions.cols)[0] == 'undefined'){
        _.each(completeCols, function(cc){
            cc.shift();
        });
    }

    // console.log('titlesComplete');
    // console.log(titlesComplete);
    //
    // console.log('completeCols');
    // console.log(completeCols);
    // console.log('completeRows');
    // console.log(completeRows);

    return {cols: completeCols, rows: completeRows, titlesSize: titles.length};
};

function setType(variable, type){
    switch (type && type.toLowerCase()) {
        case 'integer':
            return parseInt(variable, 10) || 0;
            break;
        case 'float':
            return parseFloat(variable) || 0;
            break;
        case 'string':
        default:
            return variable
    }
}

export default {
    delimeter, select, widgetsPluginLoader, generatedData, setType
};