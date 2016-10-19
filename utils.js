/**
 * Created by utking on 10/19/16.
 * Uses features: Array.isArray
 */

(function () {
    var lib = {};

    lib.filterHaving = function (items, fields) {
        var _fieldsArray = [];
        var result = [];
        if (Array.isArray(fields)) {
            for (var f in fields) {
                _fieldsArray.push(fields[f]);
            }
        } else {
            for (var f in fields) {
                _fieldsArray.push(f);
            }
        }
        if (Array.isArray(items)) {
            var _hit;
            result = items.filter(function (i) {
                _hit = false;
                _fieldsArray.forEach(function (f) {
                    if (!_hit && i[f]) {
                        _hit = true;
                    }
                });
                return _hit;
            });
        }
        return result;
    };

    return lib;

})();