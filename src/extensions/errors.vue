<template>
    <div>
        <div class="widgets-errors">
            <strong>{{ $t("errors") }}:</strong>
            <ul>
                <li v-for="item in errors">
                    {{item.message}}
                </li>
            </ul>
        </div>
        <links :obj="obj" :func="func" :title="title" :exclude="exclude"></links>
    </div>
</template>
<script>
    export default {
        name: 'errors',
        props: ['errors', 'obj', 'func', 'title', 'exclude']
    }
</script>