import React from 'react';
import ReactDOM from 'react-dom';
import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch';
import _ from 'lodash';

export function render(element, parameters){

    let options = _.merge({
        url: '/graphql',
        query: '',
        method: 'post',
        variables: '',
        showVariables: true,
        onEditQuery: function(){},
        onEditVariables: function(){}
    }, parameters);

    function graphQLFetcher(graphQLParams) {
        return fetch(options.url, {
            method: options.method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(graphQLParams),
        }).then(response => response.json());
    }

    ReactDOM.render(
        React.createElement(GraphiQL, {
            fetcher: graphQLFetcher,
            query: options.query,
            variables: options.variables,
            // operationName: parameters.operationName,
            onEditQuery: options.onEditQuery,
            onEditVariables: options.onEditVariables,
            defaultVariableEditorOpen:options.showVariables,
            // onEditOperationName: onEditOperationName
        }),
        element
    );
}