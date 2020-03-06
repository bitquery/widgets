<template>
    <div :class="'text-center widgets-loading ' + theme_class">
        <div class="spinner-border text-info" role="status">
            <span class="sr-only">Loading...</span>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'loading',
        props: ['theme'],
        computed: {
            theme_class: function(){
                return this.theme.html_class
            }
        }
    }
</script>