<template>
    <div class="more-text">
        <div class="more-text-link" ref="moreTextLink" :style="moreTextLinkCount">{{ $tc('show_line', count, { count: count }) }}. <a class="more-link" v-on:click="more">{{ $t("show_more") }}</a></div>
        <div class="more-text-total" ref="moreTextTotal" :style="moreTextTotalCount">{{ $tc('show_line_total', count, { count: count }) }}</div>
    </div>
</template>
<script>
    export default {
        name: 'more-text',
        props: ['path', 'count', 'load_count'],
        computed: {
            changeOffset: function(){
                return this.$parent.result;
            },
            moreTextLinkCount: function(){
                if (this.$root.$options.context.query.variables.limit != this.count) {
                    return 'display: none'
                } else {
                    return 'display: block'
                }
            },
            moreTextTotalCount: function(){
                if (this.$root.$options.context.query.variables.limit != this.count) {
                    return 'display: block'
                } else {
                    return 'display: none'
                }
            },
        },
        watch: {
            changeOffset: function(val){
                if (this.$root.$options.context.query.variables.offset == 0){
                    if (this.$root.$options.context.query.variables.limit != this.count) {
                        this.$refs.moreTextLink.style.display = 'none';
                        this.$refs.moreTextTotal.style.display = 'block';
                    } else {
                        this.$refs.moreTextLink.style.display = 'block';
                        this.$refs.moreTextTotal.style.display = 'none';
                    }
                }
            }
        },
        methods: {
            more: function(e){
                var his = this;
                e.path[0].innerText = his._i18n.t("loading");
                let load_count = his.load_count;
                var cur_result = his.$root.$options.context.vm.result;
                this.$root.$options.context.query.request({count: load_count, offset: his.$root.$options.context.query.variables.offset+load_count}, function (data, it) {
                    let req_result = _.get(data, his.path, data);
                    his.$root.$options.context.vm.result = cur_result.concat(req_result);
                    e.path[0].innerText = his._i18n.t("show_more");
                    if (req_result.length != it.variables.count){
                        let elem = e.path[1];
                        elem.style.display = 'none';
                        elem.nextElementSibling.style.display = 'block';
                    }
                });
            }
        }
    }
</script>