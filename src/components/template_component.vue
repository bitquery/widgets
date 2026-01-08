<template>
    <div>{{ref()}}</div>
</template>
<script>
    export default {
        name: 'template_component',
        props: ['data', 'variables', 'options', 'theme', 'context', 'componentName'],
        mounted: function(){
            this.options.callback(this.$el, this.data.result);
        },
        methods: {
            ref: function(){
                let result = this.data.result;
                if(this.$el && this.context.query.refresh){
                    this.options.callback(this.$el, this.data.result);
                }
            }
        },
        computed: {
            callbacks: function(){
                return this.$root.$options.context.callbacks
            }
        }
    }
</script>