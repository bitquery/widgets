<template>
    <span v-html="parseAmount" :class="params.html_class"></span>
</template>
<script>
    import utils from '../lib/utils'
    export default {
        name: 'amount',
        props: ['item', 'params', 'callbacks'],
        computed: {
            parseAmount: function (){
                let it = this;

                if(typeof it.params.renderCallback === 'function'){
                    return it.params.renderCallback(it.item);
                } else {
                    let data;
                    if (Array.isArray(it.params.path)){
                        _.each(it.params.path, function(p){
                            data = _.get(it.item, p);
                            return data ? false : true;
                        });
                    } else {
                        data =  _.get(it.item, it.params.path, 0);
                    }

                    let amt = data;
                    let unit = '';

                    if (data > 1e18){
                        amt = data/1e18;
                        unit = "Q";
                    } else if (data > 1e12){
                        amt = data/1e12;
                        unit = "T";
                    } else if (data > 1e9){
                        amt = data/1e9;
                        unit = "G";
                    } else if (data > 1e6){
                        amt = data/1e6;
                        unit = "M";
                    } else if (data < 1e-3 && data > 0){
                        amt = data*1e3;
                        unit = "m";
                    }

                    return it.params.data ? it.params.data.replace('%{DATA}', (utils.delimeter(amt, {precision: 2})+unit)) : (utils.delimeter(amt, {precision: 2})+unit);
                }
            }
        }
    }
</script>