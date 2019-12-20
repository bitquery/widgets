<template>
    <a :href='url' v-if="defined">{{count}} <span class="fa fa-list"></span></a>
    <span v-else>{{parseInt(count) == 0 ? '-' : count}}</span>
</template>
<script>
    export default {
        name: 'transfer-from-address',
        props: ['count', 'currency_id', 'locale'],
        computed: {
            callbacks: function(){
                return this.$root.$options.context.callbacks
            },
            defined: function () {
                return this.callbacks.transfer_from_address == undefined || parseInt(this.count) == 0 ? false : true
            },
            url: function (){
                return this.callbacks.transfer_from_address(this.currency_id, this.$root.$options.context.query.variables.address, this.locale)
            }
        }
    }
</script>