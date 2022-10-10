<template>
    <span v-if="urlCallback"><a :href='urlCallback' v-html="text" :class="params.html_class"></a></span>
    <span v-else v-html="text" :class="params.html_class"></span>
</template>
<script>
    export default {
        name: 'string',
        props: ['item', 'params', 'callbacks'],
        computed: {
            text: function(){
                let it = this;
                if(typeof it.params.renderCallback === 'function'){
                    return it.params.renderCallback(it.item)
                } else if(it.params.forwarding == true){
                    return it.params.data ? it.params.data.replace('%{DATA}', it.item) : it.item;
                } else {
                    let data;
                    if (Array.isArray(it.params.path)){
                        _.each(it.params.path, function(p){
                            data = _.get(it.item, p);
                            return data ? false : true;
                        });
                    } else {
                        data =  _.get(it.item, it.params.path);
                    }

                  function escapeHtml(unsafe)
                  {
                    if (it.params.escape === false){
                      return unsafe
                    }else{
                      let str = String(unsafe);
                      switch(str){
                        case 'undefined':
                        case 'null':
                        case 'NaN':
                          return '';
                          break;
                        default:
                          return str
                              .replace(/&/g, "&amp;")
                              .replace(/</g, "&lt;")
                              .replace(/>/g, "&gt;")
                              .replace(/"/g, "&quot;")
                              .replace(/'/g, "&#039;");
                      }
                    }
                  }
                    return it.params.data ? it.params.data.replace('%{DATA}', escapeHtml(data)) : escapeHtml(data);
                }
            },
            urlCallback: function (){
                return  (this.params.urlCallbackName && (typeof this.callbacks[this.params.urlCallbackName] === 'function')) ? this.callbacks[this.params.urlCallbackName](this.item) : false
            }
        }
    }
</script>