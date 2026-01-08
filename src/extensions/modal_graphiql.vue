<template>
    <span v-if="defined">
        <a class="badge badge-secondary" v-on:click="showWidgetsModal">{{ link }}</a>
        <div :class="'widgets-modal ' + theme_class" :id="'widgets-modal-'+obj+rand" tabindex="-1" v-on:keyup.esc="closeWidgetsModal">
            <div class="widgets-modal-dialog">
                <div class="widgets-modal-content">
                    <div class="widgets-modal-header">
                        <button type="button" class="widgets-modal-close" v-on:click="closeWidgetsModal">&times;</button>
                        <h4 class="widgets-modal-title">{{ title }}</h4>
                    </div>
                    <div class="widgets-modal-url">
                        <div class="row">
                            <div class="col-sm-8 col-md-9 col-xl-10">
                                <input type="text" :value="context.url" class="form-control form-control-sm">
                            </div>
                            <div class="col-sm-4 col-md-3 col-xl-2">
                                <a href="https://github.com/bitquery/graphql/wiki" class='float-right' target="_blank">Docs on Github</a>
                            </div>
                        </div>
                    </div>
                    <div class="widgets-modal-body" :id="'widgets-modal-graphigl-'+obj+rand">
                        {{ $t("loading") }}
                    </div>
                    <div class="widgets-modal-footer">
                        <button type="button" class="btn btn-primary" v-on:click="closeWidgetsModalApply">{{ $t("apply_changes") }}</button>
                        <button type="button" class="btn btn-secondary" v-on:click="closeWidgetsModalRevert" v-if="!is_original">{{ $t("revert_changes") }}</button>
                        <button type="button" class="btn btn-default" v-on:click="closeWidgetsModal">{{ $t("close") }}</button>
                        <a href="https://github.com/graphql/graphiql" class="float-right">GraphiQL on GitHub</a>
                    </div>
                </div>
            </div>
        </div>
    </span>
</template>
<script>
    import utils from '../lib/utils'
    import gql from 'graphql-tag';

    export default {
        name: 'modal-graphiql',
        props: ['title', 'obj', 'link'],
        computed: {
            is_original: function(){
                let context = this.$root.$options.context;
                return context.query.query == context.query.original.query && _.isEqual(context.query.variables, context.query.original.variables)
            },
            theme_class: function(){
                let theme = this.$root.$options.context.themes[this.$root.$options.context.theme];
                return theme.html_class
            },
            defined: function () {
                return this.$root.$options.context.widgetsGraphiq
            },
            rand: function () {
                return Math.floor(Math.random() * Math.floor(100000));
            },
            context: function(){
                return this.$root.$options.context;
            }
        },
        methods: {
            showWidgetsModal: function(e){
                let _$ = utils.select;
                let element = _$('#widgets-modal-'+this.obj+this.rand);
                element.addClass('widgets-modal-show');
                _$('body').addClass('widgets-modal-open');

                let context = this.context;
                context.cache = {
                    query: context.query.gql.loc.source.body,
                    variables: JSON.stringify(context.query.variables)
                };

                utils.widgetsPluginLoader('widgetsGraphiql', context.currentScriptPath+'widgetsGraphiql.js').then(loader => {
                    widgetsGraphiql.render(document.getElementById('widgets-modal-graphigl-'+this.obj+this.rand),{
                        url: context.url,
                        query: context.cache.query,
                        variables: context.cache.variables,
                        onEditQuery: function(query){
                            context.cache.query = query
                        },
                        onEditVariables: function(variables){
                            try{
                                context.cache.variables = variables
                            } catch(err){

                            }
                        }
                    })
                });
            },
            closeWidgetsModal: function(e){
                let _$ = utils.select;
                let element = _$('#widgets-modal-'+this.obj+this.rand+'.widgets-modal-show');
                element.removeClass('widgets-modal-show');
                _$('body').removeClass('widgets-modal-open');
                this.$root.$options.context.cache = {}
            },
            closeWidgetsModalApply: function(e){
                let context = this.$root.$options.context;
                this.$root.$options.context.query.gql = gql(context.cache.query);
                this.$root.$options.context.query.query = context.cache.query;
                this.$root.$options.context.query.request(JSON.parse(context.cache.variables));
                this.closeWidgetsModal();
            },
            closeWidgetsModalRevert: function(e){
                let context = this.$root.$options.context;
                this.$root.$options.context.query.gql = gql(context.query.original.query);
                this.$root.$options.context.query.query = context.query.original.query;
                this.$root.$options.context.query.request(context.query.original.variables);
                this.closeWidgetsModal();
                this.showWidgetsModal();
            }
        }
    }
</script>