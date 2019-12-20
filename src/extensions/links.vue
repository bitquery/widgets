<template>
    <div class="widgets-links">
        <a class="badge badge-secondary">JSON</a>
        <a class="badge badge-secondary">CSV</a>
        <modal-js :obj="obj" link="JS" :func="func" :title="title"></modal-js>
        <modal-graphiql :obj="obj" link="GraphiQL" :title="title"></modal-graphiql>
    </div>
</template>
<script>
    export default {
        name: 'links',
        props: ['title', 'obj', 'func']
    }
</script>