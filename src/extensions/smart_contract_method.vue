<template>
    <a :href='url' v-if="defined">{{smartcontractmethod.name}}</a><span v-else>{{smartcontractmethod.name}}</span>
</template>
<script>
    export default {
        name: 'smart-contract-method',
        props: ['smartcontractmethod', 'locale'],
        computed: {
            callbacks: function(){
                return this.$root.$options.context.callbacks
            },
            defined: function () {
                return this.callbacks.smart_contract_method == undefined ? false : true
            },
            url: function (){
                return this.callbacks.smart_contract_method(this.smartcontractmethod.name, this.smartcontractmethod.signatureHash, this.locale)
            }
        }
    }
</script>