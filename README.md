# js-utils

Self written library containing most often used functionality for my projects

## Functions

Arrays:

- **filterHaving**: Return only items having particular properties
- **extract**: Return an array that contains only the specified properties
- **plain**: Return a plain array collected by the field property
- **addProperty**: Add property/properties specified in the fields argument
- **compactArray**: Remove `undefined` and `null` values from an array 
- **sumBy**: Calculate sum by a specified field for objects in the array

Strings:

- **trim**: Remove leading and tailing spaces
- **compact**: Remove repeated spaces in a string

Sort:

- **merge**: Merge sort
- **select**: Select sort
- **insert**: Insertion sort

*You can use a custom less-than comparator as the second parameter for 
each of these sorting functions.

Tree:

A BST (binary search tree) implementation.

## License

Mozilla Public License Version 2.0
