<template>
    <div>
        <div class="table-responsive">
            <table :class="'table table-striped table-hover table-sm widgets-table ' + theme_class">
                <thead>
                <tr>
                    <th v-for="(data, i) in dataOptions" :class="params(i).thClass" v-html="data.title ? data.title : ''"></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in data.result">
                    <td v-for="(data, i) in dataOptions" :class="params(i).tdClass" :style="params(i).tdStyle">
                        <component :is="params(i).component" :item="item" :params="params(i)" :callbacks="callbacks" v-if="params(i)"></component>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <more-text :count="data.result.length" :load_count="100" :path="data.path"></more-text>
    </div>
</template>
<script>
    export default {
        name: 'table_component',
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