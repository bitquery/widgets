<template>
    <errors :errors="errors" obj="transfers_by_currencies" func="transfers_by_currencies" :exclude="['csv']" title="Transfers By Currencies" v-if="error"></errors>
    <div class="table-responsive" v-else>
        <table :class="'table table-striped table-hover table-sm widgets-table ' + theme_class">
            <thead>
            <tr>
                <th>{{ $t("title.currency") }}</th>
                <th></th>
                <th class="text-right">{{ $t("title.receive") }}</th>
                <th class="text-right">{{ $t("title.txs") }}</th>
                <th class="text-right">{{ $t("title.send") }}</th>
                <th></th>
                <th class="text-right">{{ $t("title.txs") }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in result">
                <td><token-address :locale="locale" :name="item.currency.symbol" :addr="item.currency.address"></token-address></td>
                <td class="text-center"><i class="fa fa-sign-in text-success"></i></td>
                <td class="text-right"><amount-display :amount="item.sum_in"></amount-display></td>
                <td class="text-right"><transfer-to-address :locale="locale" :count="item.count_in" :currency_id="item.currency.currencyId"></transfer-to-address></td>
                <td class="text-right"><amount-display :amount="item.sum_out"></amount-display></td>
                <td class="text-center"><i class="fa fa-sign-out text-warning"></i></td>
                <td class="text-right"><transfer-from-address :locale="locale" :count="item.count_out" :currency_id="item.currency.currencyId"></transfer-from-address></td>
            </tr>
            </tbody>
        </table>
        <more-text :count="result.length" :load_count="100" :path="path"></more-text>
        <links obj="transfers_by_currencies" func="transfers_by_currencies" title="Transfers By Currencies"></links>
    </div>
</template>
<script>
    export default {
        name: 'transfers_by_currencies',
        data () {
            return this.$parent._data;
        },
        computed: {
            errors: function(){
                return this.$root.$options.context.query.errors
            },
            error: function(){
                return Array.isArray(this.errors) && this.errors.length > 0;
            },
            theme_class: function(){
                let theme = this.$root.$options.context.themes[this.$root.$options.context.theme];
                return theme.html_class
            }
        }
    }
</script>