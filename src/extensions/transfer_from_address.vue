<template>
    <a :href='transfer_from_path' v-if="transfer_from_path">{{count}} <span class="fa fa-list"></span></a>
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
            transfer_from_path: function (){
                return  this.callbacks.transfer_from_path == undefined ? false : this.callbacks.transfer_from_path(this.address, this.locale)
            }
        }
    }
</script>