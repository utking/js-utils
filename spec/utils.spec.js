if (!this.navigator) {
  var lib = require('../utils');
}

var items = [
  {
    name: 'Utkin',
    age: 35
  },
  {
    name: 'Ivanov'
  },
  {
    name: 'Petrov',
    age: 38
  },
  {
    age: 25,
    salary: 87000
  }
];

var plain = ['Utkin', 'Ivanov', 'Petrov'];
var newProperty = {
  city: 'Khabarovsk',
  zip: '680009'
};

var emptyStrings = ["", "    ", null, undefined];
var nonEmptyStrings = ["a", "  a  "];
var trimStrings = [
  {
    src: "abc",
    test: "abc"
  },
  {
    src: "  abc ",
    test: "abc"
  },
  {
    src: "  _  abc  ; ",
    test: "_  abc  ;"
  }
];
var sparseStrings = [
  {
    src: " a   b    c     d       .",
    test: "a b c d ."
  },
  {
    src: "abc",
    test: "abc"
  },
  {
    src: null,
    test: ""
  },
  {
    src: undefined,
    test: ""
  }
];

var arrays = [
  {
    src: [],
    test: []
  },
  {
    src: [7, 1, 3, 6, 5, 4, 2, 8],
    test: [1, 2, 3, 4, 5, 6, 7, 8]
  },
  {
    src: [7, 1, 3, 6, 5, 1, 2, 8],
    test: [1, 1, 2, 3, 5, 6, 7, 8]
  }
];


describe("Check Utils.js", function () {
  beforeEach(function () {
    expect(items.length).toEqual(4);
    expect(lib.filterHaving(items, 'salary').length).toEqual(1);
  });

  describe("filterHaving checks", function () {
    it("filterHaving() on empty array length = 0", function () {
      expect(lib.filterHaving().length).toEqual(0);
    });
    it("filterHaving() length = 0", function () {
      expect(lib.filterHaving(items).length).toEqual(0);
    });
    it("filterHaving(xxx) length = 0", function () {
      expect(lib.filterHaving(items, 'xxx').length).toEqual(0);
    });
    it("filterHaving(age) length = 2", function () {
      expect(lib.filterHaving(items, 'age').length).toEqual(3);
    });
  });

  describe("extract checks", function () {
    it("extract(salary) without arguments length = 0", function () {
      expect(lib.filterHaving().length).toEqual(0);
    });
    it("extract(salary) with just a field argument length = 0", function () {
      expect(lib.filterHaving('salary').length).toEqual(0);
    });
    it("extract(salary) on empty array length = 0", function () {
      expect(lib.filterHaving([], 'salary').length).toEqual(0);
    });
    it("extract(salary) without field length = 0", function () {
      expect(lib.filterHaving([]).length).toEqual(0);
    });
    it("extract(salary) length = 1", function () {
      expect(lib.filterHaving(items, 'salary').length).toEqual(1);
    });
    it("extract(salary)[0] has salary defined", function () {
      expect(lib.filterHaving(items, 'salary')[0].salary).toBeDefined();
    });
    it("extract(salary)[0] has name undefined", function () {
      expect(lib.filterHaving(items, 'salary')[0].name).toBeUndefined();
    });
    it("extract(salary)[0].salary == 87000", function () {
      expect(lib.filterHaving(items, 'salary')[0].salary).toEqual(87000);
    });
  });

  describe("plain checks", function () {
    it("plain(name) on empty array length = 0", function () {
      expect(lib.plain().length).toEqual(0);
    });
    it("plain(name) length = 4", function () {
      expect(lib.plain(items, 'name').length).toEqual(4);
    });
    it("plain(name) to contain undefined", function () {
      expect(lib.plain(items, 'name')).toContain(undefined);
    });
    it("plain(name) not to contain null", function () {
      expect(lib.plain(items, 'name')).not.toContain(null);
    });
    it("plain(name) length = 3", function () {
      expect(lib.compactArray(lib.plain(items, 'name')).length).toEqual(3);
    });
    it("plain(name) to contain Utkin", function () {
      expect(lib.compactArray(lib.plain(items, 'name'))).toContain('Utkin');
    });
    it("plain(name) == plain", function () {
      expect(lib.compactArray(lib.plain(items, 'name'))).toEqual(plain);
    });
  });

  describe("sumBy checks", function () {
    it("sumBy() on empty array == 0", function () {
      expect(lib.sumBy()).toEqual(0);
    });
    it("sumBy() == 0", function () {
      expect(lib.sumBy(items)).toEqual(0);
    });
    it("sumBy(age) to be NaN", function () {
      expect(lib.sumBy(items, 'age')).toBeNaN();
    });
    it("sumBy(city) to be NaN", function () {
      expect(lib.sumBy(items, 'city')).toBeNaN();
    });
    it("sumBy(filterHaving(age)) == 98", function () {
      expect(lib.sumBy(lib.filterHaving(items, 'age'), 'age')).toEqual(98);
    });
  });

  describe("addProperty checks", function () {
    it("addProperty() on empty array length == 0", function () {
      expect(lib.filterHaving(lib.addProperty(), 'zip').length).toEqual(0);
    });
    it("addProperty(items,undefined) length == 0", function () {
      expect(lib.filterHaving(lib.addProperty(items), 'zip').length).toEqual(0);
    });
    it("addProperty(items,newProperty) length == 4", function () {
      expect(lib.filterHaving(lib.addProperty(items, newProperty), 'zip').length).toEqual(4);
    });
    it("addProperty(items,newProperty) -> plain('zip') == ['680009','680009','680009','680009']", function () {
      expect(lib.plain(
        lib.filterHaving(
          lib.addProperty(items, newProperty),
          'zip'),
        'zip'))
      .toEqual(['680009','680009','680009','680009']);
    });
  });

});

describe("lib.String", function () {
  it("is empty", function () {
    emptyStrings.forEach(function (s) {
      expect(lib.String.isEmpty(s)).toBeTruthy();
    });
  });
  it("is not empty", function () {
    nonEmptyStrings.forEach(function (s) {
      expect(lib.String.isEmpty(s)).toBeFalsy();
    });
  });
  it("trimming", function () {
    trimStrings.forEach(function (s) {
      expect(lib.String.trim(s.src)).toEqual(s.test);
    });
  });
  it("compact by removing unwanted spaces", function () {
    sparseStrings.forEach(function (s) {
      expect(lib.String.compact(s.src)).toEqual(s.test);
    });
  });
});

describe("lib.Sort", function () {
  it("sort empty array", function () {
    emptyStrings.forEach(function (s) {
      expect(lib.String.isEmpty(s)).toBeTruthy();
    });
  });
  it("merge sort array", function () {
    arrays.forEach(function (a) {
      expect(lib.Sort.merge(a.src)).toEqual(a.test);
    });
  });
  it("merge sort array with custom comparator", function () {
    arrays.forEach(function (a) {
      expect(lib.Sort.merge(a.src, function (a,b) { return a < b; } )).toEqual(a.test);
    });
  });
  it("select sort array", function () {
    arrays.forEach(function (a) {
      expect(lib.Sort.select(a.src)).toEqual(a.test);
    });
  });
  it("select sort array with custome comparator", function () {
    arrays.forEach(function (a) {
      expect(lib.Sort.select(a.src, function (a,b) { return a < b; } )).toEqual(a.test);
    });
  });
  it("insertion sort array", function () {
    arrays.forEach(function (a) {
      expect(lib.Sort.insert(a.src)).toEqual(a.test);
    });
  });
  it("insertion sort array with custome comparator", function () {
    arrays.forEach(function (a) {
      expect(lib.Sort.insert(a.src, function (a,b) { return a < b; } )).toEqual(a.test);
    });
  });
});

describe("lib.Tree", function () {
  var arr = [], test = [], reverseTest = [];
  beforeEach(function () {
    arr = [75, 47, 11, 76, 52, 91, 18, 88, 69, 83];
    test = [11, 18, 47, 52, 69, 75, 76, 83, 88, 91];
    reverseTest = [91, 88, 83, 76, 75, 69, 52, 47, 18, 11];
  });
  it("empty tree to empty array", function () {
    var t = new lib.Tree();
    emptyStrings.forEach(function (s) {
      expect(t.asArray()).toEqual([]);
    });
  });
  it("tree to array", function () {
    var t = new lib.Tree(arr);
    emptyStrings.forEach(function (s) {
      expect(t.asArray()).toEqual(test);
    });
  });
  it("tree to reverse array", function () {
    var t = new lib.Tree(test);
    emptyStrings.forEach(function (s) {
      expect(t.asReverseArray()).toEqual(reverseTest);
    });
  });
  it("allow null in tree", function () {
    arr.push(null);
    test.unshift(null);
    var t = new lib.Tree(arr);
    emptyStrings.forEach(function (s) {
      expect(t.asArray()).toEqual(test);
    });
  });
  it("does not allow undefined in tree", function () {
    arr.push(undefined);
    var t = new lib.Tree(arr);
    emptyStrings.forEach(function (s) {
      expect(t.asArray()).toEqual(test);
    });
  });
  it("allow duplicaties in the tree", function () {
    arr.push(11);
    test.unshift(11);
    var t = new lib.Tree(arr);
    emptyStrings.forEach(function (s) {
      expect(t.asArray()).toEqual(test);
    });
  });
  it("free'ing", function () {
    var t = new lib.Tree(arr);
    t.free();
    emptyStrings.forEach(function (s) {
      expect(t.asArray()).toEqual([]);
    });
  });
  it("Remove elements from the tree with unique elements", function () {
    var t = new lib.Tree(arr);
    var el;
    for (var i = 0; i  < test.length; i++) {
      el = test[i];
      t.remove(el);
      expect(t.asArray()).toEqual(test.slice(i+1));
    }
  });
});

describe("lib.LocalStorage", function () {
  var t = new lib.LocalStorage('tmp');
  beforeEach(function () {
    lib.LocalStorage.localStorage = {};
    t = new lib.LocalStorage('tmp');
  });
  afterEach(function () {
    lib.LocalStorage.localStorage = {};
  });
  it("create a storage with an empty name", function () {
    expect(lib.LocalStorage).toThrowError();
  });
  it("create a storage with a proper name", function () {
    expect(t).not.toBe(undefined);
  });
  it("set value", function () {
    t.set('val1', 15);
    expect(t.get('val1')).toBe(15);
    t.remove('val1');
  });
  it("get a not existing value", function () {
    expect(t.get('val111111')).toBe(undefined);
  });
  it("get with a default value", function () {
    expect(t.get('val111111', 555)).toBe(555);
  });
  it("set array", function () {
    t.set('val1', [1,2,3]);
    expect(t.get('val1')).toEqual([1,2,3]);
  });
  it("set object", function () {
    t.set('val1', {a: 1, b: 2});
    expect(t.get('val1')).toEqual({a: 1, b: 2});
  });
  it("clean the storage", function () {
    t.set('val1', 15);
    expect(t.get('val1')).toBe(15);
    t.clean();
    expect(t.get('val1')).toBe(undefined);
  });
});
