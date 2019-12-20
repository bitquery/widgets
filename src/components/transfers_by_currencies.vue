<template>
    <div class="table-responsive">
        <table class="table table-striped table-hover table-sm">
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
                <td class="text-right"><amount-display :amount="item.in_amount"></amount-display></td>
                <td class="text-right"><transfer-to-address :locale="locale" :count="item.in_count" :currency_id="item.currency.currencyId"></transfer-to-address></td>
                <td class="text-right"><amount-display :amount="item.out_amount"></amount-display></td>
                <td class="text-center"><i class="fa fa-sign-out text-warning"></i></td>
                <td class="text-right"><transfer-from-address :locale="locale" :count="item.out_count" :currency_id="item.currency.currencyId"></transfer-from-address></td>
            </tr>
            </tbody>
        </table>
        <more-text :count="result.length" :load_count="100" :path="path"></more-text>
        <links obj="transfers_by_currencies" :link="$t('show_query')" func="transfers_by_currencies" title="Transfers By Currencies"></links>
    </div>
</template>
<script>
    export default {
        name: 'transfers_by_currencies',
        data () {
            return this.$parent._data;
        }
    }
</script>