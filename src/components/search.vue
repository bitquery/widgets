<template>
    <errors :errors="errors" obj="search" func="search" :exclude="['csv']" title="Search" v-if="error"></errors>
    <div v-else-if="count == 0">
        <h4>{{ $t("not_found", {query: query}) }}</h4>
        <p>{{ $t("please") }}</p>
    </div>
    <div v-else>
        <div v-for="item in result">
            <search-currency v-if="item.subject.__typename=='Currency'" :item="item" :redirect="redirect"></search-currency>
            <search-address v-if="item.subject.__typename=='Address'" :item="item" :redirect="redirect"></search-address>
            <br>
        </div>
        <more-text :count="result.length" :load_count="100" :path="path" v-if="count > 1"></more-text>
        <links obj="search" func="search" :exclude="['csv']" title="Search"></links>
    </div>
</template>
<script>
    export default {
        name: 'search',
        data () {
            return this.$parent._data;
        },
        computed: {
            query: function(){
                return this.$root.$options.context.query.variables.query
            },
            count: function(){
                return this.result.length;
            },
            redirect: function(){
                return (this.count == 1 ? true : false)
            },
            errors: function(){
                return this.$root.$options.context.query.errors
            },
            error: function(){
                return Array.isArray(this.errors) && this.errors.length > 0;
            }
        }
    }
</script>