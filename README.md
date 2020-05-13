# with-filter
### Typescript implementation of Scala's withFilter function

## Installation
```
npm install with-filter
```
or
```
yarn add with-filter
```

## Usage
It can be imported
```typescript
import withFilter from "with-filter";

withFilter([1, 2, 3], value => value % 2 !== 0)
  .withFilter(value => value > 1)
  .map(value => value * 2);
// Returns [6]

const arrayWithFilters = withFilter([1, 2, 3]);

arrayWithFilters(value => value % 2 !== 0)
  .withFilter(value => value > 1)
  .map(value => value * 2);
// Returns [6]
```
or added to the prototype of `Array`:
```typescript
import "with-filter/dist/extend-array-prototype";

[1, 2, 3]
  .withFilter(value => value % 2 !== 0)
  .withFilter(value => value > 1)
  .map(value => value * 2);
// Returns [6]
```