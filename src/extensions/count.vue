<template>
    <a :href='urlCallback' v-if="urlCallback" v-html="count" :class="params.html_class"><span class="fa fa-list"></span></a>
    <span v-else v-html="count" :class="params.html_class"></span>
</template>
<script>
    export default {
        name: 'count',
        props: ['item', 'params', 'callbacks'],
        computed: {
            count: function(){
                let it = this;

                if(typeof it.params.renderCallback === 'function'){
                    return it.params.renderCallback(it.item)
                } else {
                    let data;
                    if (Array.isArray(it.params.path)){
                        _.each(it.params.path, function(p){
                            data = _.get(it.item, p);
                            return data ? false : true;
                        });
                    } else {
                        data =  _.get(it.item, it.params.path, 0);
                    }
                    return it.params.data ? it.params.data.replace('%{DATA}', (parseInt(data) == 0 ? '-' : data)) : (parseInt(data) == 0 ? '-' : data);
                }
            },
            urlCallback: function (){
                return  this.params.urlCallbackName ? this.callbacks[this.params.urlCallbackName](this.item) : false
            }
        }
    }
</script>