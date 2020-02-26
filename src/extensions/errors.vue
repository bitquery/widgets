<template>
    <div>
        <h5 class="card-title">{{ $t("errors") }}</h5>
        <h6 class="card-subtitle mb-2 text-muted">{{ $t("invalid_request") }}</h6>
        <p class="card-text" v-for="item in errors">
            {{item.message}}
        </p>
    </div>
</template>
<script>
    export default {
        name: 'errors',
        props: ['errors'],
    }
</script>