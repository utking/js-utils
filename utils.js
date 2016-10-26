/**
 * Created by utking on 10/19/16.
 * Uses features: Array.isArray, filter, forEach
 */
var arg = this;
if (!this.navigator) {
    arg = module;
}
var lib = (function (module) {

    /**
     * Convert the argument into a plain array of simple strings
     * @param fields
     * @returns {Array}
     * @private
     */
    var _clearFields = function (fields) {
        var _fieldsArray = [];
        var f;
        if (!!fields) {
            if (fields.charAt) {
                // a simple string
                _fieldsArray.push(fields);
            } else if (Array.isArray(fields)) {
                // an array
                for (f in fields) {
                    if (fields.hasOwnProperty(f)) {
                        _fieldsArray.push(fields[f]);
                    }
                }
            } else {
                // other type (object, function, number, etc)
                for (f in fields) {
                    if (fields.hasOwnProperty(f)) {
                        _fieldsArray.push(f);
                    }
                }
            }
        }
        return _fieldsArray;
    };

    /**
     * Return only items having particular properties
     * @param items - array of objects
     * @param fields - array/object defining properties to filter by
     * @returns {Array}
     * @private
     */
    var _filterHaving = function (items, fields) {
        var result = [];
        var _fieldsArray = _clearFields(fields);
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

    /**
     * Return an array that contains only the objects having the specified properties
     * @param items - array of objects
     * @param fields - desired properties
     * @returns {Array}
     * @private
     */
    var _extract = function (items, fields) {
        var _fieldsArray = _clearFields(fields);
        return _filterHaving(items, _fieldsArray)
            .map(function (i) {
                var item = {};
                _fieldsArray.forEach(function (f) {
                    item[f] = i[f];
                });
                return item;
            });
    };

    /**
     * Return a plain array collected by the field property
     * @param items - array of objects
     * @param field - simple string
     * @returns {Array}
     * @private
     */
    var _plain = function (items, field) {
        var _result = [];
        if (!!field && field.charAt && Array.isArray(items)) {
            items.forEach(function (i) {
                _result.push(i[field]);
            });
        }
        return _result;
    };

    /**
     * Add property/properties specified in the fields argument
     * @param items - array of objects
     * @param fields - an object
     * @returns {Array}
     * @private
     */
    var _addProperty = function (items, fields) {
        if (Array.isArray(items)) {
            return items.map(function (i) {
                for (var f in fields) {
                    if (fields.hasOwnProperty(f)) {
                        i[f] = fields[f];
                    }
                }
                return i;
            });
        }
        return [];
    };

    /**
     * Clear the array from null and undefined values
     * or null and undefined field properties
     * @param items
     * @param field
     * @returns {Array}
     * @private
     */
    var _compactArray = function (items, field) {
        if (Array.isArray(items)) {
            return items.filter(function (i) {
                if (field !== undefined && field !== null) {
                    return !(i === undefined || i === null)
                        && !(i[field] === undefined || i[field] === null);
                } else {
                    return !(i === undefined || i === null);
                }
            });
        }
        return [];
    };

    /**
     * Sum field values of the objects in the items array
     * @param items - an array of objects
     * @param field - property name string
     * @returns {Number}
     * @private
     */
    var _sumBy = function (items, field) {
        if (Array.isArray(items) && !!field && field.charAt) {
            return items.reduce(function (prev, i) {
                return prev + Number(i[field]);
            }, 0);
        }
        return 0;
    };

    var StringLib = {
        _isEmpty: function (str) {
            return str === null || str === undefined
                || !(/^.*\w+.*$/.test(str));
        },
        _trim: function (str) {
            var trimRegExp = /^\s*([\w+:;<=>?@\[\]^_`{|}~].*[\w+:;<=>?@\[\]^_`{|}~])\s*$/;
            var result = trimRegExp.exec(str);
            if (result === null || str === null || str === undefined) {
                return "";
            }
            return result[1] ? result[1] : "";
        },
        /**
         * Remove unwanted spaces
         * @param str
         * @returns {String}
         * @private
         */
        _compact: function (str) {
            if (str === null || str === undefined || !str.charAt) {
                return "";
            }
            if (Array.prototype.filter) {
                return str.split(" ").filter(function (s) {
                    return s !== "";
                }).join(" ");
            } else {
                // Use polyfill if there is no Array.prototype.filter
                var items = str.split(" ");
                var result = [];
                for (var i = 0; i < items.length; i++) {
                    if (items[i] !== "") {
                        result.push(items[i]);
                    }
                }
                return result.join(" ");
            }
        }
    };

    var SortLib = {
        _merge: function (arr) {
            if (!arr || !Array.isArray(arr)) {
                return [];
            }
            var len = arr.length;
            if (len === 1) {
                return arr;
            }
            var halfLen = Math.round(len / 2);
            var lar = SortLib._merge(arr.slice(0, halfLen));
            var rar = SortLib._merge(arr.slice(halfLen));
            var result = [], i1, i2;
            while (lar.length && rar.length) {
                i1 = lar.shift();
                i2 = rar.shift();

                if (i1 < i2) {
                    result.push(i1);
                    rar.unshift(i2);
                } else {
                    result.push(i2);
                    lar.unshift(i1);
                }
            }
            while (lar.length) {
                result.push(lar.shift());
            }
            while (rar.length) {
                result.push(rar.shift());
            }
            return result;
        }
    };

    /**
     * Public interface
     */
    return module.exports = {
        filterHaving: _filterHaving,
        extract: _extract,
        plain: _plain,
        addProperty: _addProperty,
        compactArray: _compactArray,
        sumBy: _sumBy,

        String: {
            isEmpty: StringLib._isEmpty,
            trim: StringLib._trim,
            compact: StringLib._compact
        },

        Sort: {
            merge: SortLib._merge
        }
    };

})(arg);
