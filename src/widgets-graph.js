import vis from 'vis';
import numeral from 'numeral';
import _ from 'lodash';

export function init(selector, address, nodes, expand_path){
    this.prepareNodes = function(nodes){
        function prepareNode(node){
            if (node.address.string == '0x0000000000000000000000000000000000000000'){
                return {
                    id: node.address.string,
                    label: 'System',
                    group: 'system',
                    title: node.address.string,
                    link: ''
                };
            } else {
                return {
                    id: node.address.string,
                    label: _.truncate(node.address.string, {lenght: 15, separator: '...'}),
                    group: 'address',
                    title: node.address.string,
                    link: ''
                };
            }
        }

        var prepared = [];
        _.each(nodes, function(node){
            if (_.find(prepared, {id: node.address.string}) == undefined){
                prepared.push(prepareNode(node));
            }
        });
        return prepared;
    };

    this.prepareEdges = function(edges){
        function prepareEdge(edge){
            var currency_name = edge.currency.symbol;
            var width_counts = Math.log(edge.count)+1;
            var width = (edge.amount > 1) ? 1.5*Math.log10(edge.amount)+1 : 1;
            var value = parseFloat(edge.amount)<=1e-6 ? edge.amount : numeral(edge.amount).format('0.0000a');

            if (edge.directionTo == true){
                return {
                    from: edge.address.string,
                    to: address,
                    arrows: 'to',
                    label: value + ' ' + currency_name,
                    color: {color: 'grey', highlight: '#ff5722'},
                    font: {align: 'middle', multi: true},
                    smooth: true,
                    width: width,
                    select_type: 'select_transfers',
                    hidden: false,
                    // id: this.hashCode([e.select_type, e.from, e.to, e.label])
                };
            } else {
                return {
                    from: address,
                    to: edge.address.string,
                    arrows: 'to',
                    label: value + ' ' + currency_name,
                    color:  {color: 'black', highlight: '#ff5722'},
                    font: {align: 'middle', multi: true},
                    smooth: true,
                    width: width,
                    select_type: 'select_transfers',
                    hidden: false,
                    // id: this.hashCode([e.select_type, e.from, e.to, e.label])
                };
            }

        }

        var prepared = [];
        _.each(edges, function(edge){
            prepared.push(prepareEdge(edge));
        });
        return prepared;
    }


    this.edges = new vis.DataSet(this.prepareEdges(nodes));
    this.nodes = new vis.DataSet(this.prepareNodes(_.concat([{
        address: {
            string: address
        }
    }],nodes)));
    this.expand_path = expand_path;

    this.display_edges = {
        select_transfers: true, select_calls: true, select_references: false
    };

    this.options = {
        physics: {
            stabilization: {
                enabled: false,
                iterations: 10,
                onlyDynamicEdges: true
            },
            barnesHut: {
                damping: 0.4,
                avoidOverlap: 0.1,
                springConstant: 0.09
            }
        },
        groups: {
            smart_contract: {
                shape: 'icon',
                icon: {
                    face: 'Glyphicons Halflings',
                    code: '\ue019',
                    size: 50,
                    color: '#f0a30a'
                }
            },
            multisig: {
                shape: 'icon',
                icon: {
                    face: 'Glyphicons Halflings',
                    code: '\ue225',
                    size: 90,
                    color: '#03a9f4'
                }
            },
            address: {
                shape: 'icon',
                icon: {
                    face: 'Glyphicons Halflings',
                    code: '\ue008',
                    size: 30,
                    color: '#009688'
                }
            },
            annotated_address: {
                shape: 'icon',
                icon: {
                    face: 'Glyphicons Halflings',
                    code: '\ue008',
                    size: 30,
                    color: '#006650',
                },
                font: {
                    background: '#006650',
                    color: 'white'
                }
            },
            token: {
                shape: 'icon',
                icon: {
                    face: 'Glyphicons Halflings',
                    code: '\ue201',
                    size: 70,
                    color: '#ff5722'
                }
            },
            dex: {
                shape: 'icon',
                icon: {
                    face: 'Glyphicons Halflings',
                    code: '\ue031',
                    size: 70,
                    color: '#03a9f4'
                }
            },
            MarginPositionToken: {
                shape: 'icon',
                icon: {
                    face: 'Glyphicons Halflings',
                    code: '\ue245',
                    size: 70,
                    color: '#ff5722'
                }
            },
            system: {
                shape: 'icon',
                icon: {
                    face: 'Glyphicons Halflings',
                    code: '\ue135',
                    size: 40,
                    color: '#009688'
                }
            }
        }
    };

    this.container = document.getElementById(selector);


    this.draw = function(){
        var g = this;
        var network = new vis.Network(this.container, this, this.options);

        // network.on('dragEnd', function (t) {
        //     for(var i=0;i<t.nodes.length;i++){
        //         g.nodes.update({id: t.nodes[i], physics: false});
        //     }
        // });

        // network.on('doubleClick', function(target){
        //     if(target.nodes.length>0){
        //         var node_id = target.nodes[0];
        //         if(g.nodes.get(node_id).group!='system'){
        //             g.expand(node_id);
        //         }
        //
        //     }
        // });

        // network.on("oncontext", function (params) {
        //     if (params.nodes.length === 1) {
        //         var node = g.nodes.get(params.nodes[0]);
        //         window.open(node.link, '_blank');
        //     }
        // });

        this.network = network;
    };


    // this.freeze = function(){
    //     var g = this;
    //     g.nodes.forEach(function(node){
    //         if(node.physics!==false){
    //             g.nodes.update({id: node.id, physics: false});
    //         }
    //
    //     });
    // };

    // this.expand = function(node_address){
    //     if(!this.expand_path)
    //         return;
    //     $('#graph_status .alert').hide();
    //     $('#graph_status .status-progress').show().text('Расрытие ноды '+node_address+'...');
    //     var g = this;
    //     $.ajax(this.expand_path, {
    //         data: {
    //             node: node_address
    //         },
    //         dataType: 'json'
    //     }).done(function( data ) {
    //         g.freeze();
    //         g.process(node_address, data);
    //         $('#graph_status .alert').hide();
    //         $('#graph_status .status-info').show().text('Дважды щелкните по любому узлу, чтобы раскрыть его. Щелкните правой кнопкой мыши, чтобы открыть адрес на отдельной вкладке.');
    //     }).fail(function( x, y, error) {
    //         $('#graph_status .alert').hide();
    //         $('#graph_status .status-error').show().text('Ошибка '+error+' при раскрытии '+node_address);
    //     });
    // };

    // this.load_tx_data = function(tx_hash, request_url){
    //
    //     $('#graph_status .alert').hide();
    //     $('#graph_status .status-progress').show().text('Расрытие ноды '+tx_hash+'...');
    //     var g = this;
    //     $.ajax(request_url, {
    //         dataType: 'json',
    //     }).done(function( data ) {
    //         g.process_all_nodes(data);
    //         g.draw();
    //         $('#graph_status .alert').hide();
    //         $('#graph_status .status-info').show().text('Щелкните правой кнопкой мыши, чтобы открыть адрес на отдельной вкладке.');
    //     }).fail(function( x, y, error) {
    //         $('#graph_status .alert').hide();
    //         $('#graph_status .status-error').show().text('Ошибка '+error+' при раскрытии '+tx_hash);
    //     });
    //
    // };

    // this.process_all_nodes = function(data){
    //
    //     for(var i=0; i<data.length;i++){
    //
    //         var d = data[i];
    //         var from_node = this.nodes.get(d[0].id);
    //         if(!from_node){
    //             from_node = d[0];
    //             this.nodes.add(from_node);
    //         }
    //
    //         var to_node = this.nodes.get(d[1].id);
    //         if(!to_node){
    //             to_node = d[1];
    //             this.nodes.add(to_node);
    //         }
    //
    //         var new_edge = this.edge(from_node.id, [to_node, d[2], d[3], d[5], d[6], 1, d[7]]);
    //         if(!this.edges.get(new_edge.id)){
    //             this.edges.add(new_edge);
    //         }
    //     }
    //
    // };

    // this.process = function(node_address, data){
    //     console.log('process');
    //     console.log(node_address);
    //     console.log(data);
    //     for(var i=0;i<data.length;i++){
    //         var d = data[i];
    //         var node = this.nodes.get(data[i].address.string);
    //
    //         if(!node){
    //             this.nodes.add(data[i][0]);
    //         }
    //
    //         var new_edge = this.edge(node_address, data[i]);
    //         if(!this.edges.get(new_edge.id)){
    //             this.edges.add(new_edge);
    //         }
    //
    //     }
    //
    //
    // };

    // this.edge = function(node_address, data){
    //     var e = this.nodeData(node_address, data, data[0]);
    //     e['id'] = this.hashCode([e.select_type, e.from, e.to, e.label]);
    //     return e;
    // };

//     this.nodeData = function(node_address, data, node){
//         console.log('nodeData');
// console.log(data);
//         var currency_name;
//         var width_counts = Math.log(data[5])+1;
//         var width = (data[4] > 1) ? 1.5*Math.log10(data[4])+1 : 1
//
//         if(data[6]==1){
//             currency_name = '<b>Ether</b>';
//         }else{
//             currency_name = data[3];
//         }
//
//         var value = parseFloat(data[4])<=1e-6 ? data[4] : numeral(data[4]).format('0.0000a')
//
//         switch(data[1]){
//             case 'transfer_from':
//                 return {
//                     from: node.id,
//                     to: node_address,
//                     arrows: 'to',
//                     label: value + ' ' + currency_name,
//                     color: {color: 'grey', highlight: '#ff5722'},
//                     font: {align: 'middle', multi: true},
//                     smooth: true,
//                     width: width,
//                     select_type: 'select_transfers',
//                     hidden: !this.display_edges['select_transfers']
//                 };
//             case 'transfer_to':
//                 return {
//                     from: node_address,
//                     to: node.id,
//                     arrows: 'to',
//                     label: value + ' ' + currency_name,
//                     color:  {color: 'black', highlight: '#ff5722'},
//                     font: {align: 'middle', multi: true},
//                     smooth: true,
//                     width: width,
//                     select_type: 'select_transfers',
//                     hidden: !this.display_edges['select_transfers']
//                 };
//             case 'call':
//                 return {
//                     from: node_address,
//                     to: node.id,
//                     arrows: 'to',
//                     label: data[3],
//                     smooth: true,
//                     color:  {color: '#00FF00', highlight: '#00FF00'},
//                     width: width_counts,
//                     select_type: 'select_calls',
//                     hidden: !this.display_edges['select_calls']
//                 };
//             case 'reference':
//                 return {
//                     from: node.id,
//                     to: node_address,
//                     arrows: 'to',
//                     label: data[3],
//                     smooth: true,
//                     color:  {color: '#03a9f4', highlight: '#03a9f4'},
//                     dashes: true,
//                     width: width_counts,
//                     select_type: 'select_references',
//                     hidden: !this.display_edges['select_references']
//                 };
//             case 'called':
//                 return {
//                     from: node.id,
//                     to: node_address,
//                     arrows: 'to',
//                     label: data[3],
//                     smooth: true,
//                     color:  {color: '#00FF00', highlight: '#00FF00'},
//                     dashes: true,
//                     width: width_counts,
//                     select_type: 'select_calls',
//                     hidden: !this.display_edges['select_calls']
//                 };
//         }
//     };

    // this.hashCode = function(data){
    //
    //     var string = JSON.stringify(data);
    //     if (Array.prototype.reduce){
    //         return string.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
    //     }
    //     var hash = 0;
    //     if (string.length === 0) return hash;
    //     for (var i = 0; i < string.length; i++) {
    //         var character  = string.charCodeAt(i);
    //         hash  = ((hash<<5)-hash)+character;
    //         hash = hash & hash; // Convert to 32bit integer
    //     }
    //     return hash;
    // };

    // this.update_selector = function(selector_id, selector_checked){
    //     var g = this;
    //     g.display_edges[selector_id] = selector_checked;
    //     g.edges.forEach(function(edge){
    //         if(edge.select_type==selector_id){
    //             g.edges.update({id: edge.id, hidden: !selector_checked});
    //         }
    //
    //     });
    // };

};