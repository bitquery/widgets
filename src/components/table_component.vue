<template>
    <div>
        <div class="table-responsive">
            <table :class="'table table-striped table-hover table-sm widgets-table ' + theme_class">
                <thead>
                <tr>
                    <th v-for="(title, i) in tableOptions.title" :class="params(i).thClass" v-html="title"></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in data.result">
                    <td v-for="(data, i) in tableOptions.data" :class="params(i).tdClass">
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
            tableOptions: function(){
                return this.options.tableOptions
            },
            callbacks: function(){
                return this.$root.$options.context.callbacks
            }
        },
        methods: {
            params: function(i) {
                let data = this.tableOptions.data[i];
                switch(data.type){
                    case 'string-ellipsis':
                        return _.merge({component: 'string', thClass: '', tdClass: 'ellipsis '+ (data.html_class ? data.html_class : '')}, data);
                        break;
                    case 'string':
                        return _.merge({component: 'string', thClass: '', tdClass: (data.html_class ? data.html_class : '')}, data);
                        break;
                    case 'amount':
                        return _.merge({component: 'amount', thClass: 'text-right', tdClass: 'text-right '+ (data.html_class ? data.html_class : '')}, data);
                        break;
                    case 'count':
                        return _.merge({component: 'count', thClass: 'text-right', tdClass: 'text-right '+ (data.html_class ? data.html_class : '')}, data);
                        break;
                    default:
                        return false;
                }
            }
        }
    }
</script>