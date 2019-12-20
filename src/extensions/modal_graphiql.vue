<template>
    <span v-if="defined">
        <a class="badge badge-secondary" v-on:click="showWidgetsModal">{{ link }}</a>
        <div class="widgets-modal" :id="'widgets-modal-'+obj" tabindex="-1" v-on:keyup.esc="closeWidgetsModal">
            <div class="widgets-modal-dialog">
                <div class="widgets-modal-content">
                    <div class="widgets-modal-header">
                        <button type="button" class="widgets-modal-close" v-on:click="closeWidgetsModal">&times;</button>
                        <h4 class="widgets-modal-title">{{ title }}</h4>
                    </div>
                    <div class="widgets-modal-body" :id="'widgets-modal-graphigl-'+obj">
                        {{ $t("loading") }}
                    </div>
                    <div class="widgets-modal-footer">
                        <button type="button" class="btn btn-primary" v-on:click="closeWidgetsModalApply">{{ $t("apply_changes") }}</button>
                        <button type="button" class="btn btn-default" v-on:click="closeWidgetsModal">{{ $t("close") }}</button>
                    </div>
                </div>
            </div>
        </div>
    </span>
</template>
<script>
    import utils from '../lib/utils'

    export default {
        name: 'modal-graphiql',
        props: ['title', 'obj', 'link'],
        computed: {
            defined: function () {
                return this.$root.$options.context.widgetsGraphiq
            }
        },
        methods: {
            showWidgetsModal: function(e){
                let _$ = utils.select;
                let element = _$('#widgets-modal-'+this.obj);
                element.addClass('widgets-modal-show');
                _$('body').addClass('widgets-modal-open');

                let context = this.$root.$options.context;
                context.cache = {
                    query: context.query.gql.loc.source.body,
                    variables: JSON.stringify(context.query.variables)
                };

                utils.widgetsPluginLoader('widgetsGraphiql', context.currentScriptPath+'widgetsGraphiql.js').then(loader => {
                    widgetsGraphiql.render(document.getElementById('widgets-modal-graphigl-'+this.obj),{
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
                let element = _$('#widgets-modal-'+this.obj+'.widgets-modal-show');
                element.removeClass('widgets-modal-show');
                _$('body').removeClass('widgets-modal-open');
                this.$root.$options.context.cache = {}
            },
            closeWidgetsModalApply: function(e){
                let _$ = utils.select;
                let element = _$('#widgets-modal-'+this.obj+'.widgets-modal-show');
                element.removeClass('widgets-modal-show');
                _$('body').removeClass('widgets-modal-open');

                let context = this.$root.$options.context;
                context.query.gql = widgets.gql(context.cache.query);
                context.query.variables = JSON.parse(context.cache.variables);
                this.$root.$options.context.query.request();
            }
        }
    }
</script>