/**
 * Created by utking on 10/19/16.
 * Uses features: Array.isArray, filter, forEach
 */

'use strict';

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

    var _defaultLessCompare = function (a, b) {
        return a < b;
    };

    var SortLib = {
        _merge: function (arr, lessComp) {
            if (!arr || !Array.isArray(arr)) {
                return [];
            }
            if (typeof(lessComp) !== 'function') {
                lessComp = _defaultLessCompare;
            }
            var len = arr.length;
            if (len <= 1) {
                return arr;
            }
            var halfLen = Math.round(len / 2);
            var lar = SortLib._merge(arr.slice(0, halfLen));
            var rar = SortLib._merge(arr.slice(halfLen));
            var result = [], i1, i2;
            while (lar.length && rar.length) {
                i1 = lar.shift();
                i2 = rar.shift();

                if (lessComp(i1, i2)) {
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
        },

        _select: function (arr, lessComp) {
            if (!arr || !Array.isArray(arr)) {
                return [];
            }
            if (typeof(lessComp) !== 'function') {
                lessComp = _defaultLessCompare;
            }
            var result = arr.slice();
            var el1, el2, minElPos,
                i, j, len = result.length;
            for (i = 0; i < len - 1; i++) {
                el1 = result[i];
                minElPos = i;
                for (j = i + 1; j < len; j++) {
                    el2 = result[j];
                    if (lessComp(el2, result[minElPos])) {
                        minElPos = j;
                    }
                }
                if (i !== minElPos) {
                    el2 = result[minElPos];
                    result[minElPos] = el1;
                    result[i] = el2;
                }
            }
            return result;
        },

        _insert: function (arr, lessComp) {
            if (!arr || !Array.isArray(arr)) {
                return [];
            }
            if (typeof(lessComp) !== 'function') {
                lessComp = _defaultLessCompare;
            }
            var result = arr.slice();
            var i, j, tmp, len = result.length;
            for (i = 1; i < len; i++) {
                tmp = result[i];
                for (j = i-1; j > -1 && lessComp(tmp, result[j]); j--) {
                    result[j+1] = result[j];
                }
                result[j+1] = tmp;
            }
            return result;
        }
    };

    var Tree = function (initialValue) {
        var _Node = function (val, left, right) {
            this.val = val;
            this.left = left || null;
            this.right = right || null;
            this.count = 1;

            return this;
        };
        _Node.prototype.getRight = function () {
            return this.right;
        };
        _Node.prototype.getLeft = function () {
            return this.left;
        };
        _Node.prototype.value = function () {
            return this.val;
        };

        var _tree = null;

        var _insertNode = function(tree, val) {
            if (tree.value() === val) {
                tree.count++;
            } else if (tree.value() > val) {
                if (!tree.getLeft()) {
                    tree.left =  new _Node(val)
                } else {
                    _insertNode(tree.left, val);
                }
            } else if (tree.value() < val) {
                if (!tree.getRight()) {
                    tree.right =  new _Node(val)
                } else {
                    _insertNode(tree.right, val);
                }
            }
        };

        var _findInTree = function (tree, val) {
            if (!tree) {
                return false;
            }
            if (tree.value() === val) {
                return true;
            } else if (tree.value() > val) {
                return _findInTree(tree.left, val);
            } else if (tree.value() < val) {
                return _findInTree(tree.right, val);
            }
        };

        var _asArray = function (result, tree) {
            if (!tree) {
                return;
            }
            _asArray(result, tree.getLeft());
            for (var i = 0; i < tree.count; i++) {
                result.push(tree.value());
            }
            _asArray(result, tree.getRight());
        };

        var _asReverseArray = function (result, tree) {
            if (!tree) {
                return;
            }
            _asReverseArray(result, tree.getRight());
            for (var i = 0; i < tree.count; i++) {
                result.push(tree.value());
            }
            _asReverseArray(result, tree.getLeft());
        };

        Tree.prototype.addNode = function (val) {
            if (val === undefined) {
                return;
            }
            var arr = [];
            if (!Array.isArray(val)) {
                arr.push(val);
            } else {
                arr = val;
            }
            arr.forEach(function (item) {
                if (!_tree) {
                    _tree = new _Node(item);
                } else {
                    _insertNode(_tree, item);
                }
            });
        };

        Tree.prototype.valueOf = function () {
            return 'Tree';
        };

        Tree.prototype.toString = function () {
            return 'Tree';
        };

        Tree.prototype.find = function (val) {
            return _findInTree(_tree, val);
        };

        Tree.prototype.asArray = function () {
            var result = [];
            _asArray(result, _tree);
            return result;
        };

        Tree.prototype.asReverseArray = function () {
            var result = [];
            _asReverseArray(result, _tree);
            return result;
        };

        Tree.prototype.free = function () {
            _tree = null;
        };

        Tree.prototype.fromArray = function (arr) {
            if (Array.isArray(arr)) {
                Tree.prototype.free();
                arr.forEach(function (a) {
                    this.addNode(a);
                }, this);
            }
        };

        if (initialValue) {
            Tree.prototype.addNode(initialValue);
        }

        return this;
    };

    var LocalStorage = function(value) {
        if (!value || !value.charAt) {
            throw new Error('You should specify the basket name');
        } else {
            this.basket = value;
        }
        try {
            window;
            this.localStorage = localStorage;
        } catch (e) {
            this.localStorage = {
                store: {},
                getItem: function (prop, defVal) {
                    if (this.store[prop]) {
                        return this.store[prop];
                    }
                    return defVal !== undefined ? defVal : null;
                },
                setItem: function (prop, val) {
                    this.store[prop] = val;
                },
                removeItem: function (prop) {
                    this.store[prop] = undefined;
                }
            };
        }
        return this;
    };

    LocalStorage.prototype.set = function (prop, val) {
        if (!this.basket) {
            throw new Error('You should specify the basket name first');
            return;
        }
        if (!prop || !prop.charAt) {
            throw new Error('You should specify the property name');
            return;
        }
        return this.localStorage.setItem(this.basket+'.'+prop, JSON.stringify(val));
    };

    LocalStorage.prototype.get = function (prop, defVal) {
        if (!this.basket) {
            throw new Error('You should specify the basket name first');
            return;
        }
        if (!prop || !prop.charAt) {
            throw new Error('You should specify the property name');
            return;
        }

        var val = this.localStorage.getItem(this.basket+'.'+prop);
        if (val === null) {
            return defVal;
        }
        return JSON.parse(val);
    };

    LocalStorage.prototype.remove = function (prop) {
        if (!this.basket) {
            throw new Error('You should specify the basket name first');
            return;
        }
        if (!prop || !prop.charAt) {
            throw new Error('You should specify the property name');
            return;
        }
        return this.localStorage.removeItem(this.basket+'.'+prop);
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
            merge: SortLib._merge,
            select : SortLib._select,
            insert: SortLib._insert
        },

        Tree: Tree,
        LocalStorage: LocalStorage
    };

})(arg);
