<template>
    <div class="search-item">
        <h4><a :href='url' v-if="defined">{{item.symbol}}</a><span v-else>{{item.symbol}}</span></h4>
        <p>{{item.name}}. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    </div>
</template>
<script>
    export default {
        name: 'search-currency',
        props: ['item'],
        computed: {
            callbacks: function(){
                return this.$root.$options.context.callbacks
            },
            defined: function () {
                return this.callbacks.search_currency_address == undefined ? false : true
            },
            url: function (){
                return this.callbacks.search_currency_address(this.item.symbol, this.item.symbol, this.locale)
            }
        }
    }
</script>