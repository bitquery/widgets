<template>
    <span v-html="parseAmount"></span>
</template>
<script>
    import utils from '../lib/utils'
    export default {
        name: 'amount',
        props: ['item', 'params', 'callbacks'],
        computed: {
            parseAmount: function (){
                let data = this.params.data;
                let amount = _.get(this.item, this.params.path);
                if(parseInt(amount) == 0){
                    return data ? data.replace('%{DATA}', (this.params.path ? '-' : '')) : (this.params.path ? '-' : '');
                } else {
                    let amt = amount;
                    let unit = '';

                    if (amount > 1e18){
                        amt = amount/1e18;
                        unit = "Q";
                    } else if (amount > 1e12){
                        amt = amount/1e12;
                        unit = "T";
                    } else if (amount > 1e9){
                        amt = amount/1e9;
                        unit = "G";
                    } else if (amount > 1e6){
                        amt = amount/1e6;
                        unit = "M";
                    } else if (amount < 1e-3 && amount > 0){
                        amt = amount*1e3;
                        unit = "m";
                    } else {
                        unit = '';
                    }
                    return data ? data.replace('%{DATA}', (this.params.path ? (utils.delimeter(amt, {precision: 2})+unit) : '')) : (this.params.path ? (utils.delimeter(amt, {precision: 2})+unit) : '');
                }
            }
        }
    }
</script>