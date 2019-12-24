<template>
    <span>
        <a class="badge badge-secondary" :download="obj+'_download.csv'" target="_blank" v-on:click="downloadCsv">{{ link }}</a>
    </span>
</template>
<script>
    import utils from '../lib/utils'

    export default {
        name: 'download-csv',
        props: ['title', 'obj', 'link', 'func'],
        methods: {
            downloadCsv: function(e){
                let table = this.$root._vnode.elm.querySelector('table');
                let headers = [];
                _.each(table.querySelectorAll('th'), function(v){
                    headers.push('"'+v.innerText+'"')
                });
                let csv = headers.join(",")+"\n";
                let rows = [];
                _.each(table.querySelectorAll('tbody tr'), function(v){
                    let row = [];
                    _.each(v.querySelectorAll('td'), function(v){
                        row.push('"'+v.innerText+'"');
                    });
                    rows.push(row.join(","));
                });
                csv = csv+rows.join("\n");
                let a = this._vnode.elm.querySelector('a');
                a.href = "data:text/csv;base64," + btoa(csv);
            },
        }
    }
</script>