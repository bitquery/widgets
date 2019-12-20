function delimeter(number, p = {}){ // object p (delimiter, separator, precision)
    let num, pre;

    if (!p.delimiter) {p.delimiter  = ',';}
    if (!p.separator) {p.separator = '.';}
    if (!p.precision) {p.precision = 4;}

    let numarr = parseFloat(number).toFixed(p.precision).split('.');
    num = numarr[0];
    pre = numarr[1];
    for (var i=num.length-3;i > 0 ;i=i-3) {
        num=num.slice(0,i)+p.delimiter.toString()+num.slice(i);
    }

    return num+p.separator+pre;
}

function select(selector){
    let selectorType = 'querySelectorAll';

    let obj = {
        selector: selector,
        elements: document[selectorType](selector),
        addClass: function(classname){
            _.each(this.elements, function (element) {
                element.classList.add(classname);
            });
            return this;
        },
        removeClass: function(classname){
            _.each(this.elements, function (element) {
                element.classList.remove(classname);
            });
            return this;
        }
    }

    return obj;
};

function widgetsPluginLoader(obj, url){
    // If already included in the page:
    if (window[obj]) {
        return Promise.resolve(window[obj])
    }
    if (!window[obj+'LoaderPromise']) {
        window[obj+'LoaderPromise'] = new Promise(resolve => {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.onload = () => resolve(window[obj]);
            script.src = url;
            document.body.appendChild(script)
        })
    }
    return window[obj+'LoaderPromise']
};

export default {
    delimeter, select, widgetsPluginLoader
};