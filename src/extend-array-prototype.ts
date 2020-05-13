import WithFilter from "./WithFilter";

declare global {
  interface Array<T> {
    withFilter(filter: (value: T) => boolean): WithFilter<T>;
  }
}

if (!Array.prototype.withFilter) {
  Array.prototype.withFilter = function <T>(
    this: T[],
    filter: (value: T) => boolean
  ): WithFilter<T> {
    return new WithFilter(this, filter);
  };
}
