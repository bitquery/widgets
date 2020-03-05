<template>
    <div>
            <div class="table-responsive">
                <table :class="'table table-sm widgets-table ' + theme_class">
                    <thead>
                    <tr>
                        <th>{{ $t("title.pair") }}</th>
                        <th></th>
                        <th></th>
                        <th class="text-right">{{ $t("title.buy") }}</th>
                        <th class="text-left"></th>
                        <th class="text-right">{{ $t("title.sell") }}</th>
                        <th class="text-left"></th>
                        <th></th>
                        <th class="text-right">{{ $t("title.trade") }}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <template v-for="item in data.result">
                        <tr v-if="item.trades_as_buyer > 0">
                            <td :rowspan="item.trades_as_buyer > 0 && item.trades_as_seller >0 ? 2 : 1" style="vertical-align: middle"><a :href='trades_pair_path' v-if="trades_pair_path">{{item.baseCurrency.symbol}}/{{item.quoteCurrency.symbol}}</a><span v-else>{{item.baseCurrency.symbol}}/{{item.quoteCurrency.symbol}}</span></td>
                            <td>{{ $t("title.buy") }}</td>
                            <td class="text-right"><i class="fa fa-sign-in text-success"></i></td>
                            <td class="text-right"><amount-display :amount="item.buyQuoteAmount"></amount-display></td>
                            <td class="text-left">{{item.quoteCurrency.symbol}}</td>
                            <td class="text-right"><amount-display :amount="item.buyBaseAmount"></amount-display></td>
                            <td class="text-left">{{item.baseCurrency.symbol}}</td>
                            <td class="text-left"><i class="fa fa-sign-out text-warning"></i></td>
                            <td class="text-right"><trades-count :locale="data.locale" :count="item.trades_as_buyer" address="test"></trades-count></td>
                        </tr>
                        <tr v-if="item.trades_as_seller > 0">
                            <td v-if="item.trades_as_buyer == 0" style="vertical-align: middle"><a :href='trades_pair_path' v-if="trades_pair_path">{{item.baseCurrency.symbol}}/{{item.quoteCurrency.symbol}}</a><span v-else>{{item.baseCurrency.symbol}}/{{item.quoteCurrency.symbol}}</span></td><td v-else class="d-none"></td>
                            <td>{{ $t("title.sell") }}</td>
                            <td class="text-right"><i class="fa fa-sign-in text-success"></i></td>
                            <td class="text-right"><amount-display :amount="item.sellBaseAmount"></amount-display></td>
                            <td class="text-left">{{item.baseCurrency.symbol}}</td>
                            <td class="text-right"><amount-display :amount="item.sellQuoteAmount"></amount-display></td>
                            <td class="text-left">{{item.quoteCurrency.symbol}}</td>
                            <td class="text-left"><i class="fa fa-sign-out text-warning"></i></td>
                            <td class="text-right"><trades-count :locale="data.locale" :count="item.trades_as_seller" address="test"></trades-count></td>
                        </tr>
                    </template>
                    </tbody>
                </table>
            </div>
            <more-text :count="data.result.length" :load_count="100" :path="path"></more-text>
    </div>
</template>
<script>
    export default {
        name: 'trades_by_currencies',
        props: ['data', 'variables', 'theme', 'context', 'componentName'],
        computed: {
            theme_class: function(){
                return this.theme.html_class
            },
            callbacks: function(){
                return this.context.callbacks
            },
            trades_pair_path: function(){
                return  this.callbacks.trades_pair_path == undefined ? false : this.callbacks.trades_pair_path(item.baseCurrency.symbol+"/"+item.quoteCurrency.symbol, this.data.locale)
            }
        }
    }
</script>