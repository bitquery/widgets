<template>
    <a :href='transfer_to_path' v-if="transfer_to_path">{{count}} <span class="fa fa-list"></span></a>
    <span v-else>{{parseInt(count) == 0 ? '-' : count}}</span>
</template>
<script>
    export default {
        name: 'transfer-to-address',
        props: ['count', 'currency_id', 'locale'],
        computed: {
            callbacks: function(){
                return this.$root.$options.context.callbacks
            },
            transfer_to_path: function (){
                return  this.callbacks.transfer_to_path == undefined ? false : this.callbacks.transfer_to_path(this.address, this.locale)
            }
        }
    }
</script>