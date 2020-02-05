<template>
    <a :href='smart_contract_method_path' v-if="smart_contract_method_path">{{smartcontractmethod.name}}</a><span v-else>{{smartcontractmethod.name}}</span>
</template>
<script>
    export default {
        name: 'smart-contract-method',
        props: ['smartcontractmethod', 'locale'],
        computed: {
            callbacks: function(){
                return this.$root.$options.context.callbacks
            },
            smart_contract_method_path: function (){
                return  this.callbacks.smart_contract_method_path == undefined ? false : this.callbacks.smart_contract_method_path(this.smartcontractmethod.name, this.smartcontractmethod.signatureHash, this.locale)
            }
        }
    }
</script>