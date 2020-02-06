import './scss/widgets.scss';
import ApolloClient from 'apollo-boost';
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import Vue from 'vue';
import VueI18n from 'vue-i18n'
import _ from 'lodash';
import VueGoogleCharts from 'vue-google-charts'

// Запрос схемы с типами
// __schema{
//     types{
//         kind
//         name
//         possibleTypes{
//             name
//         }
//     }
// }



const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: {
        __schema: {
            types: [
                {
                    kind: 'UNION',
                    name: 'SearchResultItem',
                    possibleTypes: [
                        { name: 'Address' },
                        { name: 'Currency' }
                    ],
                },
            ],
        },
    },
});

const cache = new InMemoryCache({ fragmentMatcher });

let Locales = {};

const requireLocale = require.context(
    './locales',
    false,
    /\.json$/
);

requireLocale.keys().forEach(fileName => {
    const name = fileName.match(/\.\/(.*).json$/);
    Locales[name[1]] = requireLocale(fileName);
});

const requireExtensions = require.context(
    './extensions',
    false,
    /\.vue$/
);
requireExtensions.keys().forEach(fileName => {
    const componentConfig = requireExtensions(fileName);
    const componentName = componentConfig.default.name;

    Vue.component(
        componentName,
        componentConfig.default || componentConfig
    )
});

const requireComponents = require.context(
    './components',
    false,
    /\.vue$/
);

let Components = {};
requireComponents.keys().forEach(fileName => {
    const component = requireComponents(fileName);
    const componentName = component.default.name;
    Components[componentName] = component.default || component;
});

VueI18n.prototype.getChoiceIndex = function (choice, choicesLength) {
    if (this.locale !== 'ru') {}
    if (choice === 0) {return 0;}

    const teen = choice > 10 && choice < 20;
    const endsWithOne = choice % 10 === 1;

    if (!teen && endsWithOne) {return 1;}
    if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {return 2;}
    return (choicesLength < 4) ? 2 : 3;
};
Vue.use(VueGoogleCharts);
Vue.use(VueI18n);
const messages = Locales;

let apollo = {};

let currentScriptPath = document.currentScript.src.split('/');
currentScriptPath.pop();

let props = {
    locale: 'en',
    currentScriptPath: currentScriptPath.join('/')+'/',
    widgetsGraphiq: true,
    callbacks: {},
    theme: 'light',
    themes: {
        'light': {
            html_class: '',
            text: '#343a40',
            background: '#ffffff'
        },
        'dark': {
            html_class: 'dark',
            text: '#ffffff',
            background: 'transparent'
        }
    }
};

export function init(url, apikey, options = {}){
    options['url'] = url;
    options['apikey'] = apikey;
    props = _.merge(props, options);
    apollo = new ApolloClient({uri: options['url'], cache});
    return props
}

export function callbacks(cbs = {}){
    props.callbacks = _.merge(props.callbacks, cbs);
    return props.callbacks
}

export function query(query){
    let properties = {
        query: query,
        gql: gql(query),
        data: {},
        components: [],
        set: function(query){
            properties.query = query;
            properties.gql = gql(query);
            return properties;
        },
        request: function(p = {}, thenResult = function(result, it){}){
        var it = this;

        let variables = {
            "limit": 10,
            "offset": 0
        };

        it.variables = _.merge(variables, it.variables, p);

        apollo
            .query({
                query: it['gql'],
                variables: it.variables,
                errorPolicy: 'all'
            })
            .then(function(result){
                it.data = result.data;
                it.errors = Array.isArray(result.errors) && result.errors.length > 0 ? result.errors : [];
                _.each(it.components,function(component){
                    component.render()
                });
                thenResult(result.data, it);
            });
        return this;
    }
    };
    return properties;
}

export function component(name, selector, query, path){
    let properties = {
        name: name,
        selector: selector,
        query: query,
        path: path,
        render: function(){
            var it = this;

            if (it.vm == undefined){
                it.vmi18n = new VueI18n({
                    locale: it.locale,
                    fallbackLocale: 'en',
                    messages,
                });
                it.vm = new Vue({
                    el: it.selector,
                    i18n: it.vmi18n,
                    context: it,
                    data: {
                        locale: it.vmi18n.locale,
                        path: it.path,
                        result: query.data == undefined ? undefined : _.get(query.data, it.path, query.data)
                    },
                    render: h => h(Components[it.name])
                });
            } else {
                it.vm.locale = it.vmi18n.locale = it.locale;
                it.vm.result = query.data == undefined ? undefined : _.get(query.data, it.path, query.data);
            }
        }
    };

    properties = _.merge(properties, props);
    query.components.push(properties);
    return properties;
}

export function transfers_by_currencies(selector, query, path = 'transfers'){
    return component('transfers_by_currencies', selector, query, path);
}

export function trades_by_currencies(selector, query, path = 'trades'){
    return component('trades_by_currencies', selector, query, path);
}

export function transfers_by_time(selector, query, path = 'transfers'){
    return component('transfers_by_time', selector, query, path);
}

export function trades_by_time(selector, query, path = 'trades'){
    return component('trades_by_time', selector, query, path);
}

export function transaction_by_time(selector, query, path = 'transfers'){
    return component('transaction_by_time', selector, query, path);
}

export function calls_by_time(selector, query, path = 'calls'){
    return component('calls_by_time', selector, query, path);
}

export function search(selector, query, path = 'search'){
    return component('search', selector, query, path);
}

// export function transfers_in_out(selector, query, path = 'address.transfersInOut'){
//     return component('transfers_in_out', selector, query, path);
// }

export function calls_smart_contracts(selector, query, path = 'calls'){
    return component('calls_smart_contracts', selector, query, path);
}