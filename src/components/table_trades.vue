<template>
    <div>
        <div class="table-responsive">
            <table :class="'table table-hover table-sm widgets-table ' + theme_class">
                <thead>
                <tr>
                    <th v-for="(data, i) in dataOptions" :class="params(i).thClass" v-html="data.title ? data.title : ''"></th>
                </tr>
                </thead>
                <tbody>
                <template v-for="item in data.result">
                    <tr v-if="item.trades_as_buyer > 0">
                        <td :rowspan="item.trades_as_buyer > 0 && item.trades_as_seller >0 ? 2 : 1" style="vertical-align: middle" :class="params(0).tdClass">
                            <component :is="params(0).component" :item="item" :params="col_str(item.baseCurrency.symbol+'/'+item.quoteCurrency.symbol, params(0))" :callbacks="callbacks" v-if="params(0)"></component>
                        </td>
                        <td :class="params(1).tdClass">
                            <component :is="params(1).component" :item="item" :params="col_str($t('title.buy'), params(1))" :callbacks="callbacks" v-if="params(1)"></component>
                        </td>
                        <td :class="params(2).tdClass">
                            <component :is="params(2).component" :item="item" :params="params(2)" :callbacks="callbacks" v-if="params(2)"></component>
                        </td>
                        <td :class="params(3).tdClass">
                            <component :is="params(3).component" :item="item" :params="col_path('buyQuoteAmount', params(3))" :callbacks="callbacks" v-if="params(3)"></component>
                        </td>
                        <td :class="params(4).tdClass">
                            <component :is="params(4).component" :item="item" :params="col_path('quoteCurrency.symbol', params(4))" :callbacks="callbacks" v-if="params(4)"></component>
                        </td>
                        <td :class="params(5).tdClass">
                            <component :is="params(5).component" :item="item" :params="col_path('buyBaseAmount', params(5))" :callbacks="callbacks" v-if="params(5)"></component>
                        </td>
                        <td :class="params(6).tdClass">
                            <component :is="params(6).component" :item="item" :params="col_path('baseCurrency.symbol', params(6))" :callbacks="callbacks" v-if="params(6)"></component>
                        </td>
                        <td :class="params(7).tdClass">
                            <component :is="params(7).component" :item="item" :params="params(7)" :callbacks="callbacks" v-if="params(7)"></component>
                        </td>
                        <td :class="params(8).tdClass">
                            <component :is="params(8).component" :item="item" :params="col_path('trades_as_buyer', params(8))" :callbacks="callbacks" v-if="params(8)"></component>
                        </td>
                    </tr>
                    <tr v-if="item.trades_as_seller > 0">
                        <td v-if="item.trades_as_buyer == 0" style="vertical-align: middle" :class="params(0).tdClass">
                            <component :is="params(0).component" :item="item" :params="col_str(item.baseCurrency.symbol+'/'+item.quoteCurrency.symbol, params(0))" :callbacks="callbacks" v-if="params(0)"></component>
                        </td><td v-else class="d-none"></td>
                        <td :class="params(1).tdClass">
                            <component :is="params(1).component" :item="item" :params="col_str($t('title.sell'), params(1))" :callbacks="callbacks" v-if="params(0)"></component>
                        </td>
                        <td :class="params(2).tdClass">
                            <component :is="params(2).component" :item="item" :params="params(2)" :callbacks="callbacks" v-if="params(2)"></component>
                        </td>
                        <td :class="params(3).tdClass">
                            <component :is="params(3).component" :item="item" :params="col_path('sellBaseAmount', params(3))" :callbacks="callbacks" v-if="params(3)"></component>
                        </td>
                        <td :class="params(4).tdClass">
                            <component :is="params(4).component" :item="item" :params="col_path('baseCurrency.symbol', params(4))" :callbacks="callbacks" v-if="params(4)"></component>
                        </td>
                        <td :class="params(5).tdClass">
                            <component :is="params(5).component" :item="item" :params="col_path('sellQuoteAmount', params(5))" :callbacks="callbacks" v-if="params(5)"></component>
                        </td>
                        <td :class="params(6).tdClass">
                            <component :is="params(6).component" :item="item" :params="col_path('quoteCurrency.symbol', params(6))" :callbacks="callbacks" v-if="params(6)"></component>
                        </td>
                        <td :class="params(7).tdClass">
                            <component :is="params(7).component" :item="item" :params="params(7)" :callbacks="callbacks" v-if="params(7)"></component>
                        </td>
                        <td :class="params(8).tdClass">
                            <component :is="params(8).component" :item="item" :params="col_path('trades_as_seller', params(8))" :callbacks="callbacks" v-if="params(8)"></component>
                        </td>
                    </tr>
                </template>
                </tbody>
            </table>
        </div>
        <more-text :count="data.result.length" :load_count="100" :path="data.path"></more-text>
    </div>
</template>
<script>
    export default {
        name: 'table_trades',
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
            }
        },
        methods: {
            col_str: function(data, params){
                return _.merge(params,{data: data})
            },
            col_path: function(path, params){
                return _.merge(params,{path: path})
            },
            params: function(i) {
                let data = this.dataOptions[i];
                let parameters = {component: 'string', thClass: '', tdClass: (data.html_class ? data.html_class : ''), tdStyle: (data.style ? data.style : '')};
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
                        return _.merge(parameters, {component: 'amount', thClass: 'text-right', tdClass: 'text-right '+ parameters.tdClass}, data);
                        break;
                    case 'count':
                        return _.merge(parameters, {component: 'count', thClass: 'text-right', tdClass: 'text-right '+ parameters.tdClass}, data);
                        break;
                    case 'string':
                    default:
                        return _.merge(parameters, data);
                }
            }
        }
    }
</script>