<template>
    <a :href='url' v-if="defined">{{count}} <span class="fa fa-list"></span></a>
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
            defined: function () {
                return this.callbacks.call_count == undefined || parseInt(this.count) == 0 ? false : true
            },
            url: function (){
                return this.callbacks.transfer_from_address(this.address, this.locale)
            }
        }
    }
</script>