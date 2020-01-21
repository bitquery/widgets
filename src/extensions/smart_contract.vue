<template>
    <a :href='url' v-if="defined">{{name}}</a><span v-else>{{name}}</span>
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
                return (this.smartcontract.address.annotation == undefined ? this.smartcontract.address.address : this.smartcontract.address.annotation)
            },
            defined: function () {
                return this.callbacks.smart_contract == undefined ? false : true
            },
            url: function (){
                //let name = this.smartcontract.annotation == undefined ? this.smartcontract.address : this.smartcontract.annotation
                return this.callbacks.smart_contract(this.name, this.smartcontract.address.address, this.locale)
            }
        }
    }
</script>