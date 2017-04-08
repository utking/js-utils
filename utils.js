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
        if (fields) {
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
        },

        _qSort: function(list, l, r) {
            if (list.length === 0) return;
            var pivotIndex = _findPivotIndex(l, r - l);
            _swap(list, pivotIndex, r);
            var k = _partition(list, l - 1, r, list[r]);
            _swap(list, k, r);
            if (k - l > 1) {
                _qSort(list, l, k - 1);
            }
            if (r - k > 1) {
                _qSort(list, k + 1, r);
            }
        },

        _findPivotIndex: function(base, len) {
            return base + Math.floor(len/2);
        },

        _partition: function(list, l, r, pivotValue) {
            do {
                while (list[++l] < pivotValue);
                while (r != 0 && list[--r] > pivotValue);
                _swap(list, l, r);
            } while (l < r);
                _swap(list, l, r);
            return l;
        },

        _swap: function(list, i, j) {
            var tmp = list[i];
            list[i] = list[j];
            list[j] = tmp;
        }

        _quicksort: function(list) {
            var listCopy = list.slice(0);
            _qSort(listCopy, 0, listCopy.length - 1);
            return listCopy;
        }
    };

    /**
     * A Binary Search Tree implementation
     * @param initialValue
     * @returns {Tree}
     * @constructor
     */
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

        /**
         * Insert a node with the 'val' value into the tree
         * @param tree
         * @param val
         * @private
         */
        var _insertNode = function(tree, val) {
            if (tree.value() === val) {
                tree.count++;
            } else if (tree.value() > val) {
                if (!tree.getLeft()) {
                    tree.left =  new _Node(val);
                } else {
                    _insertNode(tree.left, val);
                }
            } else if (tree.value() < val) {
                if (!tree.getRight()) {
                    tree.right =  new _Node(val);
                } else {
                    _insertNode(tree.right, val);
                }
            }
        };

        /**
         * Find the val in the tree
         * @param tree
         * @param val
         * @returns {boolean}
         * @private
         */
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

        /**
         * Find the a node in the tree by the value
         * @param tree
         * @param val
         * @returns {object}
         * @private
         */
        var _findNodeByValue = function (tree, val) {
            var leftNode, rightNode;
            if (!tree) {
                // an empty tree
                return null;
            }
            if (tree.value() === val) {
                // the root node
                return {
                    parent: null,
                    node: tree
                };
            } else if (tree.left || tree.right) {
                // check the current two children
                leftNode = tree.left;
                rightNode = tree.right;
                if (leftNode && leftNode.value() === val) {
                    // the root node
                    return {
                        parent: tree,
                        node: leftNode
                    };
                } else if (rightNode && rightNode.value() === val) {
                    // the root node
                    return {
                        parent: tree,
                        node: rightNode
                    };
                }
                // there was no luck, go further
                if (tree.value() > val) {
                    return _findNodeByValue(tree.left, val);
                } else if (tree.value() < val) {
                    return _findNodeByValue(tree.right, val);
                }

            } else {
                return null;
            }
        };

        /**
         * Get the node holding the max value in the tree
         * @param tree
         * @param prev
         * @returns {*}
         * @private
         */
        var _getMaxNode = function (tree, prev) {
            if (!tree) {
                return {
                    parent: prev ? prev : null,
                    node: null
                };
            }
            if (!tree.right) {
                return {
                    parent: prev ? prev : null,
                    node: tree
                };
            }
            return _getMaxNode(tree.right, tree);
        };

        /**
         * Get the node holding the min value in the tree
         * @param tree
         * @param prev
         * @returns {*}
         * @private
         */
        var _getMinNode = function (tree, prev) {
            if (!tree) {
                return {
                    parent: null,
                    node: null
                };
            }
            if (!tree.left) {
                return {
                    parent: prev,
                    node: tree
                };
            }
            return _getMinNode(tree.left, tree);
        };

        /**
         * Convert the tree into a sorted array
         * @param result
         * @param tree
         * @private
         */
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

        /**
         * Convert the tree into a reverse sorted array
         * @param result
         * @param tree
         * @private
         */
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

        /**
         * Add a node with the 'val' value into the tree
         * @param val
         * @return {Tree}
         */
        Tree.prototype.addNode = function (val) {
            if (val !== undefined) {
                // convert the val into an array if it isn't
                var arr = [];
                if (!Array.isArray(val)) {
                    arr.push(val);
                } else {
                    arr = val;
                }
                arr.forEach(function (item) {
                    // add each element into the tree
                    if (!_tree) {
                        _tree = new _Node(item);
                    } else {
                        _insertNode(_tree, item);
                    }
                });
            }
            return this;
        };

        /**
         * Replace the default [Object object] output
         * @returns {string}
         */
        Tree.prototype.valueOf = function () {
            return 'Tree';
        };

        /**
         * Replace the default [Object object] output
         * @returns {string}
         */
        Tree.prototype.toString = function () {
            return 'Tree';
        };

        /**
         * Find the val in the tree
         * @param val
         * @returns {boolean}
         */
        Tree.prototype.find = function (val) {
            return _findInTree(_tree, val);
        };

        /**
         * Return the max element in the tree
         * or null value if the tree is empty
         * @returns {null}
         */
        Tree.prototype.max = function () {
            var result = _getMaxNode(_tree, null);
            return (result && result.node) ? result.node.val : null;
        };

        /**
         * Return the min element in the tree
         * or null value if the tree is empty
         * @returns {null}
         */
        Tree.prototype.min = function () {
            var result = _getMinNode(_tree, null);
            return (result && result.node) ? result.node.val : null;
        };

        /**
         * Remove an item with the 'val' value
         * @param val
         * @param removeAll
         * @returns {Tree}
         */
        Tree.prototype.remove = function (val, removeAll) {
            var result = _findNodeByValue(_tree, val);
            // there was no such node
            if (!result || !result.node) {
                return this;
            }
            // there is such a node.
            // and it can be simply decreased
            if (!removeAll && result.node.count > 1) {
                result.node.count--;
                return this;
            }
            //
            if (result.node.left && !result.node.right) {
                // just a left child
                if (result.parent) {
                    result.parent.left = result.node.left;
                } else {
                    _tree = result.node.left;
                }
                result.node = null;
                return this;
            }
            if (result.node.right && !result.node.left) {
                // just a right child
                if (result.parent) {
                    result.parent.left = result.node.right;
                } else {
                    _tree = result.node.right;
                }
                result.node = null;
                return this;
            }
            if (!result.node.right && !result.node.left) {
                // no children at all
                if (result.parent) {
                    if (result.parent.left === result.node) {
                        result.parent.left = null;
                    } else {
                        result.parent.right = null;
                    }
                } else {
                    _tree = null;
                }
                result.node = null;
                return this;
            } else {
                // both children are here
                // get the max from the left subtree
                var maxLeft = _getMaxNode(result.node, null);
                // its parent cannot be null since the both children are here
                // so, cut the old connection
                maxLeft.parent.right = null;
                // update parent-child connection
                if (result.parent) {
                    // if there is a parent
                    // which child to be updated
                    if (result.parent.left === result.node) {
                        result.parent.left = maxLeft.node;
                    } else {
                        result.parent.right = maxLeft.node;
                    }
                } else {
                    // if the node was the root
                    _tree = maxLeft.node;
                }
                // get the min node from the left subtree
                var minLeftSubtree = _getMinNode(maxLeft.node, null);
                // and refresh the subtree with  the right subtree of the node to delete
                minLeftSubtree.node.left = result.node.right;
                // find the new min node
                minLeftSubtree = _getMinNode(minLeftSubtree.node, null);
                // and append
                minLeftSubtree.node.left = result.node.left;
                return this;
            }

        };

        /**
         * Return the tree as a sorted array
         * @returns {Array}
         */
        Tree.prototype.asArray = function () {
            var result = [];
            _asArray(result, _tree);
            return result;
        };

        /**
         * Return the tree as a reverse order sorted array
         * @returns {Array}
         */
        Tree.prototype.asReverseArray = function () {
            var result = [];
            _asReverseArray(result, _tree);
            return result;
        };

        /**
         * Forget about the tree's elements
         * @return {Tree}
         */
        Tree.prototype.free = function () {
            _tree = null;
            return this;
        };

        /**
         * Free thr tree and fill that with the 'arr' array
         * @param arr
         * @return {Tree}
         */
        Tree.prototype.fromArray = function (arr) {
            if (Array.isArray(arr)) {
                Tree.prototype.free();
                arr.forEach(function (a) {
                    this.addNode(a);
                }, this);
            }
            return this;
        };

        /**
         * Initialize the tree with the initialValue is
         * that was specified
         */
        if (initialValue) {
            Tree.prototype.addNode(initialValue);
        }

        return this;
    };

    /**
     * LocalStorage class allowing to store any types including
     * arrays and objects. Uses localStorage when it's possible
     * or internal storage if not
     * @param value
     * @returns {LocalStorage}
     * @constructor
     */
    var LocalStorage = function(value) {
        if (!value || !value.charAt) {
            throw new Error('You should specify the basket name');
        } else {
            this.basket = value;
        }
        try {
            // try to use the built-in localStorage
            this.localStorage = window.localStorage;
        } catch (e) {
            // or use an object-based replacement
            var _store = {};

            var _getItem = function (prop, defVal) {
                if (_store[prop]) {
                    return _store[prop];
                }
                return defVal !== undefined ? defVal : null;
            };

            var _setItem = function (prop, val) {
                _store[prop] = val;
            };

            var _removeItem = function (prop) {
                _store[prop] = undefined;
            };

            var _clean = function () {
                _store = {};
            };

            this.localStorage = {
                getItem: _getItem,
                setItem: _setItem,
                removeItem: _removeItem,
                clean: _clean
            };
        }
        return this;
    };

    /**
     * Save the 'val' into the storage as a variable
     * with the 'prop' name
     * @param prop
     * @param val
     */
    LocalStorage.prototype.set = function (prop, val) {
        if (!this.basket) {
            throw new Error('You should specify the basket name first');
        }
        if (!prop || !prop.charAt) {
            throw new Error('You should specify the property name');
        }
        this.localStorage.setItem(this.basket+'.'+prop, JSON.stringify(val));
        return this;
    };

    /**
     * Get a value of the variable 'prop'. Return
     * defVal if there is no such 'prop' in the storage
     * @param prop
     * @param defVal
     * @returns {*}
     */
    LocalStorage.prototype.get = function (prop, defVal) {
        if (!this.basket) {
            throw new Error('You should specify the basket name first');
        }
        if (!prop || !prop.charAt) {
            throw new Error('You should specify the property name');
        }

        var val = this.localStorage.getItem(this.basket+'.'+prop);
        if (val === null) {
            return defVal;
        }
        return JSON.parse(val);
    };

    /**
     * Remove the item with the 'prop' name
     * @param prop
     */
    LocalStorage.prototype.remove = function (prop) {
        if (!this.basket) {
            throw new Error('You should specify the basket name first');
        }
        if (!prop || !prop.charAt) {
            throw new Error('You should specify the property name');
        }
        this.localStorage.removeItem(this.basket+'.'+prop);
        return this;
    };

    /**
     * Clean all the variables whose names start with the basket name
     */
    LocalStorage.prototype.clean = function () {
        var r = new RegExp('^'+this.basket+'\\.');
        try {
            // determine what storate to use
            for (var i in window.localStorage) {
                if (r.test(i)) {
                    this.localStorage.removeItem(i);
                }
            }
        } catch (e) {
            this.localStorage.clean();
        }
        return this;
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
            quicksort : SortLib._quicksort,
            insert: SortLib._insert
        },

        Tree: Tree,
        LocalStorage: LocalStorage
    };

})(arg);
