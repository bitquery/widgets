<template>
    <div class="widgets-links">
<!--        <a class="badge badge-secondary">JSON</a>-->
        <download-csv :obj="obj" link="CSV" :func="func" :title="title" v-if="eexclude('csv')"></download-csv>
        <modal-js :obj="obj" link="JS" :func="func" :title="title" v-if="eexclude('js')"></modal-js>
        <modal-graphiql :obj="obj" link="GraphiQL" :title="title" v-if="eexclude('graphql')"></modal-graphiql>
    </div>
</template>
<script>
    export default {
        name: 'links',
        props: ['title', 'obj', 'func', 'exclude'],
        methods: {
            eexclude: function(name) {
                return !_.includes(this.exclude, name);
            }
        }
    }
</script>