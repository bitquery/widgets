<template>
    <a :href='token_path' v-if="token_path">{{name}}</a><span v-else>{{name}}</span>
</template>
<script>
    export default {
        name: 'token-address',
        props: ['name', 'addr', 'locale'],
        computed: {
            callbacks: function(){
                return this.$root.$options.context.callbacks
            },
            token_path: function (){
                return  this.callbacks.token_path == undefined ? false : this.callbacks.token_path(this.name, this.addr, this.locale)
            }
        }
    }
</script>