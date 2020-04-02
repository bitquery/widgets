<template>
    <div>
        <div>
            <ul :class="'list-group list-group-flush '+(options.html_class ? options.html_class : '')">
                <li v-for="item in data.result" :class="'list-group-item '+params.html_class">
                    <component :is="params.component" :item="item" :params="params" :callbacks="callbacks" v-if="params"></component>
                </li>
            </ul>
        </div>
        <more-text :count="data.result.length" :load_count="100" :path="data.path"></more-text>
    </div>
</template>
<script>
    export default {
        name: 'list_component',
        props: ['data', 'variables', 'options', 'theme', 'context', 'componentName'],
        computed: {
            callbacks: function(){
                return this.$root.$options.context.callbacks
            },
            params: function() {
                let data = this.options.dataOptions;
                switch(data.type){
                    case 'string':
                        return _.merge({component: 'string', html_class: ''}, data);
                        break;
                    case 'amount':
                        return _.merge({component: 'amount', html_class: ''}, data);
                        break;
                    case 'count':
                        return _.merge({component: 'count', html_class: ''}, data);
                        break;
                    default:
                        return false;
                }
            }
        }
    }
</script>