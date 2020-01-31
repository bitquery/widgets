<template>
    <errors :errors="errors" obj="calls_smart_contracts" func="calls_smart_contracts" :exclude="['csv']" title="Calls Smart Contracts" v-if="error"></errors>
    <div class="table-responsive" v-else>
        <table :class="'table table-striped table-hover table-sm widgets-table ' + theme_class">
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
        <links obj="calls_smart_contracts" func="calls_smart_contracts" title="Calls Smart Contracts"></links>
    </div>
</template>
<script>
    export default {
        name: 'calls_smart_contracts',
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