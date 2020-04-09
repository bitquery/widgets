<template>
    <div :class="options.html_class" :style="params.style">
        <template v-for="item in data.result">
            <component :is="params.component" :item="item" :params="params" :callbacks="callbacks" v-if="params"></component>
        </template>
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
                let data = this.options.dataOptions;
                let parameters = {component: 'string', thClass: '', html_class: (data.html_class ? data.html_class : ''), style: (data.style ? data.style : '')};
                switch(data.type){
                    case 'string':
                        return _.merge(parameters, {component: 'string'}, data);
                        break;
                    case 'amount':
                        return _.merge(parameters, {component: 'amount'}, data);
                        break;
                    case 'count':
                        return _.merge(parameters, {component: 'count'}, data);
                        break;
                    default:
                        return false;
                }
            }
        }
    }
</script>