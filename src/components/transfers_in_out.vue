<template>
    <div class="widgets-graph-window">
        <div class="widgets-graph-menu">
            <div class="row">
                <div class="widgets-graph-selector col-sm-10">
                </div>

                <div class="col-sm-2">

                    <a href="#" class="pull-right widgets-graph-full" v-on:click="widgetsGraphFullscreen">
                        <div>{{ $t("fullscreen") }} <span class="fa fa-window-maximize"></span></div>
                    </a>

                    <a href="#" class="pull-right widgets-graph-small" v-on:click="widgetsGraphFullscreenSmall">
                        <div>{{ $t("exit_fullscreen") }} <span class="fa fa-window-restore"></span></div>
                    </a>


                </div>

            </div>
        </div>

        <div id="widgets-graph"></div>

        <div id="widgets-graph-status">
            <div class="alert alert-light text-primary status-info" role="alert" style="display: none;"></div>
            <div class="alert alert-info status-progress" role="alert" style="display: none;"></div>
            <div class="alert alert-danger status-error" role="alert" style="display: none;"></div>
        </div>
        <links obj="transfers_in_out" :link="$t('show_query')" func="transfers_in_out" title="Transfers In Out"></links>
    </div>
</template>
<script>
    import utils from '../lib/utils'
    export default {
        name: 'transfers_in_out',
        data () {
            return this.$parent._data;
        },
        mounted(){
            let context = this.$root.$options.context;
            let address = context.query.variables.address;
            let it = this;
            utils.widgetsPluginLoader('widgetsGraph', context.currentScriptPath+'widgetsGraph.js').then(loader => {
                var graph = new widgetsGraph.init('widgets-graph', address, it.result, '---');
                graph.draw();
            });
        },
        methods: {
            widgetsGraphFullscreen: function(e){
                let _$ = utils.select;
                let element = _$('.widgets-graph-window');
                element.addClass('widgets-graph-window-fullscreen');
                _$('body').addClass('widgets-modal-open');
            },
            widgetsGraphFullscreenSmall: function(e){
                let _$ = utils.select;
                let element = _$('.widgets-graph-window');
                element.removeClass('widgets-graph-window-fullscreen');
                _$('body').removeClass('widgets-modal-open');
            }
        }
    }
</script>