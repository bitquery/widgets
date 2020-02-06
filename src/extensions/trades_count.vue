<template>
    <a :href='trades_count_path' v-if="trades_count_path">{{count}} <span class="fa fa-list"></span></a>
    <span v-else>{{parseInt(count) == 0 ? '-' : count}}</span>
</template>
<script>
    export default {
        name: 'trades-count',
        props: ['count', 'address', 'locale'],
        computed: {
            callbacks: function(){
                return this.$root.$options.context.callbacks
            },
            trades_count_path: function (){
                return  this.callbacks.trades_count_path == undefined ? false : this.callbacks.trades_count_path(this.address, this.locale)
            }
        }
    }
</script>