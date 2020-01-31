<template>
    <div class="search-item">
        <h4><a :href='url' v-if="defined">{{item.subject.address}}</a><span v-else>{{item.subject.address}}</span></h4>
        <small>{{ $t("network") }}: {{item.network.network}}</small>
        <p>{{item.subject.annotation}}</p>
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
                return this.callbacks.search_address_address(this.item.network.network, this.item.subject.address, this.$root.locale)
            }
        }
    }
</script>