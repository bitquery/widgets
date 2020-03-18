<template>
    <span v-if="urlCallback"><a :href='urlCallback' v-html="text"></a></span>
    <span v-else v-html="text"></span>
</template>
<script>
    export default {
        name: 'string',
        props: ['item', 'params', 'callbacks'],
        computed: {
            text: function(){
                let it = this;
                let params_data = this.renderCallback ? this.renderCallback : this.params.data;
                let data;

                if (Array.isArray(this.params.path)) {
                    _.each(this.params.path, function(p){
                         data ? '' : data = _.get(it.item, p);
                    });
                } else {
                    data = this.params.path ? _.get(this.item, this.params.path) : '';
                }

                return params_data ? params_data.replace('%{DATA}', (data ? data : '')) : (data ? data : '');
            },
            urlCallback: function (){
                return  this.callbacks[this.params.urlCallbackName] ? this.callbacks[this.params.urlCallbackName](this.item) : false
            },
            renderCallback: function (){
                return  this.callbacks[this.params.renderCallbackName] ? this.callbacks[this.params.renderCallbackName](this.item) : false
            }
        }
    }
</script>