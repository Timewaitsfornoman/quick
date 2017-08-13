function getParameter() {

    var data = {};
    var parameter = window.location.href.split('?')[1];

    if (!!parameter) {

        var itemArry = [];
        var parameterArray = parameter.split('&');
        var length = parameterArray.length;

        for (var i = 0; i <= length; i++) {
            itemArry = parameterArray[i].split('=');
            if (!!itemArry[0]) {
                data[itemArry[0]] = itemArry[1];
            }
        }
    }
    return data;
}

module.exports = getParameter;