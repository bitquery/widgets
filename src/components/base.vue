<template>
    <div style="position:relative;height:100%">
<!--        <loading :theme="theme"></loading>-->
        <loading v-if="context.query.is_request" :theme="theme"></loading>
        <div :class="context.query.is_request ? 'widgets-blur': ''">
            <errors :errors="data.errors" v-if="is_error"></errors>
            <nodata v-else-if="is_no_data" :options="options"></nodata>
            <component :is="componentName" :data="data" :variables="variables" :options="options" :theme="theme" :context="context" :componentName="componentName" v-else></component>
        </div>
<!--        <links :obj="componentName" :func="func" :exclude="exclude" :title="title"></links>-->
        <div style="margin-top: 5px;float: right; cursor: pointer;">
          <a v-on:click="handleOpenIde" class="badge badge-secondary open-btn">Get API</a>
        </div>

    </div>
</template>
<script>
    export default {
        name: 'base',
        data () {
            let context = this.$root.$options.context;
            return {
                options: context.options,
                title: context.options.title,
                exclude: context.options.excludeButtons,
                componentName: context.name,
                func: context.funcName,
                context: context,
                theme: context.themes[context.theme],
                variables: context.query.variables,
                data: this.$parent._data,
            }
        },
        computed: {
            is_error: function(){
                return Array.isArray(this.data.errors) && this.data.errors.length > 0;
            },
            is_no_data: function(){
                return Array.isArray(this.data.result) && this.data.result.length < 1;
            }
        },
        methods: {
          handleOpenIde: function() {
            let createHiddenField = function(name, value) {
              let input = document.createElement('input');
              input.setAttribute('type', 'hidden');
              input.setAttribute('name', name);
              input.setAttribute('value', value);
              return input;
            }

            let form = document.createElement('form');
            form.setAttribute('method', 'post');
            form.setAttribute('action', this.data.ideUrl);
            form.setAttribute('target', '_blank');
            form.setAttribute('enctype', 'application/json');
            form.appendChild(createHiddenField('query', JSON.stringify(this.context.query.query)));
            form.appendChild(createHiddenField('variables', JSON.stringify(this.context.query.variables)));
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          }
        }
    }
</script>