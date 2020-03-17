<template>
    <a :href='urlCallback' v-if="urlCallback" v-html="count"><span class="fa fa-list"></span></a>
    <span v-else v-html="count"></span>
</template>
<script>
    export default {
        name: 'count',
        props: ['item', 'params', 'callbacks'],
        computed: {
            count: function(){
                let data = this.params.data;
                let count = _.get(this.item, this.params.path);
                return data ? data.replace('%{DATA}', (this.params.path ? (parseInt(count) == 0 ? '-' : count) : '')) : (this.params.path ? (parseInt(count) == 0 ? '-' : count) : '');
            },
            urlCallback: function (){
                return  this.callbacks[this.params.urlCallbackName] ? this.callbacks[this.params.urlCallbackName](this.item) : false
            }
        }
    }
</script>