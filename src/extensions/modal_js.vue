<template>
    <span>
        <a class="badge badge-secondary" v-on:click="showWidgetsModal">{{ link }}</a>
        <div class="widgets-modal" :id="'widgets-modal-js-'+obj" tabindex="-1" v-on:keyup.esc="closeWidgetsModal">
            <div class="widgets-modal-dialog">
                <div class="widgets-modal-content">
                    <div class="widgets-modal-header">
                        <button type="button" class="widgets-modal-close" v-on:click="closeWidgetsModal">&times;</button>
                        <h4 class="widgets-modal-title">{{ title }}</h4>
                    </div>
                    <div class="widgets-modal-body">
<textarea style="width: 100%; height: 100%;">
<script>
    widgets.init('{{ context.url }}', '{{ context.apikey }}', {locale: '{{ context.locale }}'});
    var query = new widgets.query(`{{ context.query.query }}
    }`);
</script>
<div id="{{ context.selector.replace('#', '') }}"></div>
<script>
    var tbc = new widgets.{{ func }}('{{ context.selector }}', query, '{{ context.path }}');
    query.request({{variables}});
</script>
</textarea>
                    </div>
                    <div class="widgets-modal-footer">
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
        name: 'modal-js',
        props: ['title', 'obj', 'link', 'func'],
        computed: {
            context: function() {
                return this.$root.$options.context;
            },
            variables: function(){
                let context = this.$root.$options.context;
                let var_arr = [];
                _.each(context.query.variables, function(value, key){
                    var_arr.push('"'+key+'": "'+value+'"');
                });
                return '{'+var_arr.join(',')+'}';
            }
        },
        methods: {
            showWidgetsModal: function(e){
                let _$ = utils.select;
                let element = _$('#widgets-modal-js-'+this.obj);
                element.addClass('widgets-modal-show');
                _$('body').addClass('widgets-modal-open');

                let context = this.$root.$options.context;
            },
            closeWidgetsModal: function(e){
                let _$ = utils.select;
                let element = _$('#widgets-modal-js-'+this.obj+'.widgets-modal-show');
                element.removeClass('widgets-modal-show');
                _$('body').removeClass('widgets-modal-open');
            }
        }
    }
</script>