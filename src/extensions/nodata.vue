<template>
    <div v-if="noData" v-html="noData">
    </div>
    <div v-else>
        <h5 class="card-title">{{ $t('no_data') }}</h5>
        <h6 class="card-text mb-2">{{ $t('response_is_empty') }}</h6>
    </div>
</template>
<script>
    export default {
        name: 'nodata',
        props: ['options'],
        computed: {
            noData: function(){
                return this.options.noData;
            }
        }
    }
</script>