<template>
    <div>
        <div class="table-responsive">
            <table :class="'table table-striped table-hover table-sm widgets-table ' + theme_class">
                <thead>
                <tr v-for="(item, j) in generatedData.cols[0]">
                    <th v-for="(col, i) in generatedData.cols" :class="params(i).tdClass" :style="params(i).tdStyle">{{col[j]}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="row in generatedData.rows">
                    <td v-for="(item,i) in row" :class="params(i).tdClass" :style="params(i).tdStyle">
                        <component :is="params(i).component" :item="item" :params="params(i)" :callbacks="callbacks"></component>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
<!--        <more-text :count="data.result.length" :load_count="100" :path="data.path"></more-text>-->
    </div>
</template>
<script>
    import utils from "../lib/utils";

    export default {
        name: 'table_pivot',
        props: ['data', 'variables', 'options', 'theme', 'context', 'componentName'],
        computed: {
            theme_class: function(){
                return this.theme.html_class
            },
            dataOptions: function(){
                return this.options.dataOptions
            },
            callbacks: function(){
                return this.$root.$options.context.callbacks
            },
            generatedData: function(){
                return utils.generatedData(this);
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
                let data = this.dataOptions && this.dataOptions[i] || {};
                let parameters = {component: 'string', forwarding: true, thClass: '', tdClass: (data.html_class ? data.html_class : ''), tdStyle: (data.style ? data.style : '')};
                switch(data.type){
                    case 'string-ellipsis':
                        parameters.tdClass = 'ellipsis '+ parameters.tdClass;
                        return _.merge(parameters, data);
                        break;
                    case 'string-wrap':
                        parameters.tdClass = 'word-wrap '+ parameters.tdClass;
                        return _.merge(parameters, data);
                        break;
                    case 'amount':
                        return _.merge(parameters, {component: 'amount', thClass: 'text-end', tdClass: 'text-end '+ parameters.tdClass}, data);
                        break;
                    case 'count':
                        return _.merge(parameters, {component: 'count', thClass: 'text-end', tdClass: 'text-end '+ parameters.tdClass}, data);
                        break;
                    case 'string':
                    default:
                        return _.merge(parameters, data);
                }
            }
        }
    }
</script>