<template>
    <div v-if="redirect">
        {{ $t("redirect") }} {{redirect_location}}
    </div>
    <div class="search-item" v-else>
        <div v-if="search_address_snippet" v-html="search_address_snippet">
            {{search_address_snippet}}
        </div>
        <div v-else>
            <h4><a class="word-wrap" :href='urlCallback' v-if='urlCallback'>{{$t("search_snippet_title", {"network": item.network.network, "address": item.subject.address})}}</a><span class="word-wrap" v-else>{{$t("search_snippet_title", {"network": item.network.network, "address": item.subject.address})}}</span></h4>
            <p>{{item.subject.annotation}}</p>
            <a :href='urlCallback' class="word-wrap" v-if="urlCallback">{{search_address_address}}</a>

            <span v-if="urlCallback"><a :href='urlCallback' v-html="text" :class="params.html_class"></a></span>
            <span v-else v-html="text" :class="params.html_class"></span>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'search-address',
        props: ['item', 'redirect', 'params', 'callbacks'],
        computed: {
            redirect_location: function(){
                if (this.redirect){
                    location.href = this.search_address_path;
                }
                return '';
            },
            callbacks: function(){
                return this.$root.$options.context.callbacks
            },
            search_address_path: function (){
                return this.callbacks.search_address_path == undefined ? false : this.callbacks.search_address_path(this.item.network.network, this.item.subject.address, this.$root.locale)
            },
            search_address_snippet: function(){
                return  this.callbacks.search_address_snippet == undefined ? false : this.callbacks.search_address_snippet(this.item, this.$root.locale)
            },
            urlCallback: function (){
                return  this.params.urlCallbackName ? this.callbacks[this.params.urlCallbackName](this.item) : false
            }
        }
    }
</script>