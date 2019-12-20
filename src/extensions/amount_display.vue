<template>
    <span>{{parseInt(amount) == 0 ? '-' : parseAmount}}</span>
</template>
<script>
    import utils from '../lib/utils'
    export default {
        name: 'amount-display',
        props: ['amount', 'currency'],
        computed: {
            parseAmount: function (){
                let amount = this.amount;
                let currency = this.currency == undefined ? '' : ' '+this.currency;
                let amt = amount;
                let unit = '';

                if (amount > 1e18){
                    amt = amount/1e18;
                    unit = "Q"+currency;
                } else if (amount > 1e12){
                    amt = amount/1e12;
                    unit = "T"+currency;
                } else if (amount > 1e9){
                    amt = amount/1e9;
                    unit = "G"+currency;
                } else if (amount > 1e6){
                    amt = amount/1e6;
                    unit = "M"+currency;
                } else if (amount < 1e-3 && amount > 0){
                    amt = amount*1e3;
                    unit = "m"+currency;
                } else {
                    unit = currency;
                }
                return utils.delimeter(amt, {precision: 2})+unit;
            }
        }
    }
</script>