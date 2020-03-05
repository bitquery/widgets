<template>
    <div>
        <div class="table-responsive">
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
                <tr v-for="item in data.result">
                    <td class="ellipsis"><span><token-address :locale="data.locale" :name="item.currency.symbol" :addr="item.currency.address"></token-address></span></td>
                    <td class="text-center"><i class="fa fa-sign-in text-success"></i></td>
                    <td class="text-right"><amount-display :amount="item.sum_in"></amount-display></td>
                    <td class="text-right"><transfer-to-address :locale="data.locale" :count="item.count_in" :currency_id="item.currency.currencyId"></transfer-to-address></td>
                    <td class="text-right"><amount-display :amount="item.sum_out"></amount-display></td>
                    <td class="text-center"><i class="fa fa-sign-out text-warning"></i></td>
                    <td class="text-right"><transfer-from-address :locale="data.locale" :count="item.count_out" :currency_id="item.currency.currencyId"></transfer-from-address></td>
                </tr>
                </tbody>
            </table>
        </div>
        <more-text :count="data.result.length" :load_count="100" :path="data.path"></more-text>
    </div>
</template>
<script>
    export default {
        name: 'transfers_by_currencies',
        props: ['data', 'variables', 'theme', 'context', 'componentName'],
        computed: {
            theme_class: function(){
                return this.theme.html_class
            }
        }
    }
</script>