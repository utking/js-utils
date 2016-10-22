let items = [
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

describe("Check Utils.js", function () {
  beforeEach(function () {
    expect(items.length).toEqual(4);
    expect(lib.filterHaving(items, 'salary').length).toEqual(1);
  });
    
  describe("filterHaving checks", function () {
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