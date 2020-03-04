<template>
    <div class="more-text">
        <div class="more-text-link" v-if="is_more">{{ $tc('show_line', count, { count: count }) }}. <a class="more-link" v-on:click="more">{{ $t("show_more") }}</a></div>
        <div class="more-text-total" v-else>{{ $tc('show_line_total', count, { count: count }) }}</div>
    </div>
</template>
<script>
    export default {
        name: 'more-text',
        props: ['path', 'count', 'load_count'],
        data() {
            return {context: this.$root.$options.context}
        },
        computed: {
            is_more: function(){
                if (this.context.is_request == true){
                    return true;
                } else {
                    return this.count == this.context.query.variables.limit + this.context.query.variables.offset ? true : false
                }
            }
        },
        methods: {
            more: function(e){
                var his = this;
                e.path[0].innerText = his._i18n.t("loading");
                let load_count = his.load_count;
                var cur_result = his.context.vm.result;
                his.context.is_request = true;
                this.context.query.request({limit: load_count, offset: (this.context.query.variables.limit + this.context.query.variables.offset)}, function (data, it) {
                    let req_result = _.get(data, his.path, data);
                    his.context.vm.result = cur_result.concat(req_result);
                    e.path[0].innerText = his._i18n.t("show_more");
                    his.context.is_request = undefined;
                });
            }
        }
    }
</script>