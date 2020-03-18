<template>
    <div :class="params.html_class">
        <component :is="params.component" :item="data.result[0]" :params="params" :callbacks="callbacks" v-if="params"></component>
    </div>
</template>
<script>
    export default {
        name: 'text_component',
        props: ['data', 'variables', 'options', 'theme', 'context', 'componentName'],
        computed: {
            callbacks: function(){
                return this.$root.$options.context.callbacks
            },
            params: function() {
                let data = this.options.textOptions;
                switch(data.type){
                    case 'string':
                        return _.merge({component: 'string', html_class: ''}, data);
                        break;
                    case 'amount':
                        return _.merge({component: 'amount', html_class: ''}, data);
                        break;
                    default:
                        return false;
                }
            }
        }
    }
</script>