<template>
    <a :href='call_count_path' v-if="call_count_path">{{count}} <span class="fa fa-list"></span></a>
    <span v-else>{{parseInt(count) == 0 ? '-' : count}}</span>
</template>
<script>
    export default {
        name: 'call-count',
        props: ['count', 'address', 'locale'],
        computed: {
            callbacks: function(){
                return this.$root.$options.context.callbacks
            },
            call_count_path: function (){
                return  this.callbacks.call_count_path == undefined ? false : this.callbacks.call_count_path(this.address, this.locale)
            }
        }
    }
</script>