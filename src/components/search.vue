<template>
    <div>
        <div v-for="item in result">
            <search-currency v-if="item.subject.__typename=='Currency'" :item="item"></search-currency>
            <search-address v-if="item.subject.__typename=='Address'" :item="item"></search-address>
            <br>
        </div>
        <more-text :count="result.length" :load_count="100" :path="path"></more-text>
        <links obj="search" :link="$t('show_query')" func="search" title="Search"></links>
    </div>
</template>
<script>
    export default {
        name: 'search',
        data () {
            return this.$parent._data;
        }
    }
</script>