<template>
    <div>
        <div class="table-responsive">
            <table :class="'table table-striped table-hover table-sm widgets-table ' + theme_class">
                <thead>
                <tr>
                    <th>{{ $t("title.smart_contract") }}</th>
                    <th>{{ $t("title.method") }}</th>
                    <th class="text-right">{{ $t("title.tx_count") }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in data.result">
                    <td class="ellipsis"><span><smart-contract :locale="data.locale" :smartcontract="item.smartContract"></smart-contract></span></td>
                    <td class="ellipsis"><span><smart-contract-method :locale="data.locale" :smartcontractmethod="item.smartContractMethod"></smart-contract-method></span></td>
                    <td class="text-right"><call-count :locale="data.locale" :count="item.count" :address="item.smartContract.address.address"></call-count></td>
                </tr>
                </tbody>
            </table>
        </div>
        <more-text :count="data.result.length" :load_count="100" :path="data.path"></more-text>
    </div>
</template>
<script>
    export default {
        name: 'calls_smart_contracts',
        props: ['data', 'variables', 'theme', 'context', 'componentName'],
        computed: {
            theme_class: function(){
                return this.theme.html_class
            }
        }
    }
</script>