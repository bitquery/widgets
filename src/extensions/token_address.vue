<template>
    <a :href='url' v-if="defined">{{name}}</a><span v-else>{{name}}</span>
</template>
<script>
    export default {
        name: 'token-address',
        props: ['name', 'addr', 'locale'],
        computed: {
            callbacks: function(){
                return this.$root.$options.context.callbacks
            },
            defined: function () {
                return this.callbacks.token_address == undefined ? false : true
            },
            url: function (){
                return this.callbacks.token_address(this.name, this.addr, this.locale)
            }
        }
    }
</script>