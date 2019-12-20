<template>
    <div class="table-responsive">
        <table class="table table-striped table-hover table-sm">
            <thead>
            <tr>
                <th>{{ $t("title.smart_contract") }}</th>
                <th>{{ $t("title.method") }}</th>
                <th class="text-right">{{ $t("title.tx_count") }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in result">
                <td><smart-contract :locale="locale" :smartcontract="item.smartContract"></smart-contract></td>
                <td><smart-contract-method :locale="locale" :smartcontractmethod="item.smartContractMethod"></smart-contract-method></td>
                <td class="text-right"><call-count :locale="locale" :count="item.count" :address="item.smartContract.address.address"></call-count></td>
            </tr>
            </tbody>
        </table>
        <more-text :count="result.length" :load_count="100" :path="path"></more-text>
        <links obj="calls_smart_contracts" :link="$t('show_query')" func="calls_smart_contracts" title="Calls Smart Contracts"></links>
    </div>
</template>
<script>
    export default {
        name: 'calls_smart_contracts',
        data () {
            return this.$parent._data;
        }
    }
</script>