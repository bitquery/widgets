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
          <a v-on:click="handleOpenIde" class="badge badge-secondary open-btn">Open GraphQL IDE</a>
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
            let wwindow = window.open()
            fetch(this.data.ideUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              body: JSON.stringify({
                query: this.context.query.query,
                variables: JSON.stringify(this.context.query.variables),
              }),
            })
                .then((res) => {
                  if (res.status === 200 || res.status === 302) {
                    wwindow.location.href = res.url
                    // window.open(res.url, '_blank').focus()
                    // res.redirect(302, res.url)
                  } else {
                    console.log(res.message)
                  }
                })
          }
        }
    }
</script>