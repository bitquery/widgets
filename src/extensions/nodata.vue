<template>
    <div>
        <h5 class="card-title">{{ $t('no_data') }}</h5>
        <h6 class="card-subtitle mb-2 text-muted">{{ $t('response_is_empty') }}</h6>
        <p class="card-text">
            {{ $t('please') }}
        </p>
    </div>
</template>
<script>
    export default {
        name: 'nodata'
    }
</script>