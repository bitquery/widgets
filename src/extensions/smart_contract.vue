<template>
    <a :href='smart_contract_path' v-if="smart_contract_path">{{name}}</a><span v-else>{{name}}</span>
</template>
<script>
    export default {
        name: 'smart-contract',
        props: ['smartcontract', 'locale'],
        computed: {
            callbacks: function(){
                return this.$root.$options.context.callbacks
            },
            name: function(){
                return ((this.smartcontract.address.annotation == undefined || this.smartcontract.address.annotation == '')  ? this.smartcontract.address.address : this.smartcontract.address.annotation)
            },

            smart_contract_path: function (){
                return  this.callbacks.smart_contract_path == undefined ? false : this.callbacks.smart_contract_path(this.name, this.smartcontract.address.address, this.locale)
            }
        }
    }
</script>