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
- **quicksort**: Quicksort

_You can use a custom less-than comparator as the second parameter for 
each of these sorting functions._

Tree:

A BST (binary search tree) implementation.

- **c-tor**: constructor allowing setting an initial values from an array
- **free**: clean the tree (allows chaining)
- **addNode**: add a node in the tree (allows chaining)
- **find**: check if the element in the tree
- **min**: get a min element in the tree
- **max**: get a max element in the tree
- **remove**: remove an element (with or w/o all the duplicated) from the tree (allows chaining)
- **asArray**: return an array representation of the tree
- **asReverseArray**: return a reverse array representation of the tree
- **fromArray**: clean the tree and re-create it with the values in the array (allows chaining)


LocalStorage:

A standard localStorage wrapper allowing storing array and objects as well 
 as primitive types
 
- **c-tor**: constructor requires a name to connect all values with 
- **get**: get value from the localStorage by name
- **set**: put a named value in the localStorage  (allows chaining)
- **remove**: remove a named item from the localStorage (allows chaining)
- **clean**: remove the entire basket from the localStorage (allows chaining)

## License

Mozilla Public License Version 2.0
