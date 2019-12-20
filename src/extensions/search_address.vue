<template>
    <div class="search-item">
        <h4><a :href='url' v-if="defined">{{item.string}}</a><span v-else>{{item.string}}</span></h4>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    </div>
</template>
<script>
    export default {
        name: 'search-address',
        props: ['item'],
        computed: {
            callbacks: function(){
                return this.$root.$options.context.callbacks
            },
            defined: function () {
                return this.callbacks.search_address_address == undefined ? false : true
            },
            url: function (){
                return this.callbacks.search_address_address(this.item.string, this.item.string, this.locale)
            }
        }
    }
</script>