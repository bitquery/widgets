<template>
    <span>
        <a class="badge badge-secondary" v-on:click="showWidgetsModal">{{ link }}</a>
        <div :class="'widgets-modal ' + theme_class" :id="'widgets-modal-js-'+obj+rand" tabindex="-1" v-on:keyup.esc="closeWidgetsModal">
            <div class="widgets-modal-dialog">
                <div class="widgets-modal-content">
                    <div class="widgets-modal-header">
                        <button type="button" class="widgets-modal-close" v-on:click="closeWidgetsModal">&times;</button>
                        <h4 class="widgets-modal-title">{{ title }}</h4>
                    </div>
                    <div class="widgets-modal-body">
<textarea style="width: 100%; height: 100%;">
<link rel="stylesheet" media="all" href="https://cdn.jsdelivr.net/gh/bitquery/widgets@v{{version}}/dist/assets/css/widgets.css">
<script src="https://cdn.jsdelivr.net/gh/bitquery/widgets@v{{version}}/dist/widgets.js"></script>
<div id="{{ context.selector.replace('#', '') }}"></div>
<script>
    (function(){
    widgets.init('{{ context.url }}', '{{ context.apikey }}', {locale: '{{ context.locale }}', theme: '{{ context.theme }}'});
    var query = new widgets.query(`{{ context.query.query }}`);
    var wdts = new widgets.{{ func }}('{{ context.selector }}', query, '{{ context.path }}', {{ options }});
    query.request({{variables}});
    })()
</script>
</textarea>
                    </div>
                    <div class="widgets-modal-footer">
                        <button type="button" class="btn btn-secondary" v-on:click="closeWidgetsModalRevert" v-if="!is_original">{{ $t("revert_changes") }}</button>
                        <button type="button" class="btn btn-default" v-on:click="closeWidgetsModal">{{ $t("close") }}</button>
                    </div>
                </div>
            </div>
        </div>
    </span>
</template>
<script>
    import utils from '../lib/utils'
    import gql from 'graphql-tag';
    import {version} from '../../package';

    export default {
        name: 'modal-js',
        props: ['title', 'obj', 'link', 'func'],
        data() {
            return {context: this.$root.$options.context}
        },
        computed: {
            options: function(){
                let options = this.context.initialOptions;
                let renderedFunctions = {};
                let renderOptions = function(obj){
                    let ro = {};
                    _.each(obj, function(value, key){
                        if (typeof value === 'function'){
                            let rnd = Math.round(Math.random()*1000000);
                            ro[key] = "RENDER_FUNCTION_"+rnd;
                            renderedFunctions["RENDER_FUNCTION_"+rnd] = value.toString();
                        }else if(Array.isArray(value)){
                            ro[key] = value;
                        }else if(typeof value === 'object'){
                            ro[key] = renderOptions(value);
                        } else {
                            ro[key] = value;
                        }
                    });
                    return ro;
                };
                let renderedOptions = renderOptions(options);
                let str = JSON.stringify(renderedOptions, null, ' ');

                _.each(renderedFunctions, function(value, key){
                    str = str.replace('"'+key+'"', value);
                });

                return str;
            },
            is_original: function(){
              return this.context.query.query == this.context.query.original.query && _.isEqual(this.context.query.variables, this.context.query.original.variables)
            },
            theme_class: function(){
                let theme = this.context.themes[this.context.theme];
                return theme.html_class
            },
            variables: function(){
                    let var_arr = [];
                    _.each(this.context.query.variables, function(value, key){
                        var_arr.push('"'+key+'": '+(typeof value === 'string' ? '"'+value+'"' : value));
                    });
                    return '{'+var_arr.join(', ')+'}';
            },
            version: function () {
                let ver = version.split('.');
                return ver[0]+'.'+ver[1]+'.'+ver[2];
            },
            rand: function () {
                return Math.floor(Math.random() * Math.floor(100000));
            }
        },
        methods: {
            showWidgetsModal: function(e){
                let _$ = utils.select;
                let element = _$('#widgets-modal-js-'+this.obj+this.rand);
                element.addClass('widgets-modal-show');
                _$('body').addClass('widgets-modal-open');
            },
            closeWidgetsModal: function(e){
                let _$ = utils.select;
                let element = _$('#widgets-modal-js-'+this.obj+this.rand+'.widgets-modal-show');
                element.removeClass('widgets-modal-show');
                _$('body').removeClass('widgets-modal-open');
            },
            closeWidgetsModalRevert: function(e){
                this.context.query.gql = gql(this.context.query.original.query);
                this.context.query.query = this.context.query.original.query;
                this.context.query.request(this.context.query.original.variables);
                this.closeWidgetsModal();
                this.showWidgetsModal();
            }
        }
    }
</script>