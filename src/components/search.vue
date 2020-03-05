<template>
    <div v-if="count == 0">
        <p>
            <strong class="word-wrap">{{ $t("not_found", {query: query}) }}</strong><br>
            {{ $t("please") }}
        </p>
    </div>
    <div v-else>
        <div v-for="item in data.result">
            <search-currency v-if="item.subject.__typename=='Currency'" :item="item" :redirect="redirect"></search-currency>
            <search-address v-if="item.subject.__typename=='Address'" :item="item" :redirect="redirect"></search-address>
            <br>
        </div>
        <more-text :count="data.result.length" :load_count="100" :path="data.path" v-if="count > 1"></more-text>
    </div>
</template>
<script>
    export default {
        name: 'search',
        props: ['data', 'variables', 'theme', 'context', 'componentName'],
        computed: {
            query: function(){
                return this.variables.query
            },
            count: function(){
                return this.data.result.length;
            },
            redirect: function(){
                return (this.count == 1 ? true : false)
            }
        }
    }
</script>