import WithFilter from "./WithFilter";

function withFilter<T>(
  array: T[],
  filter: (value: T) => boolean
): WithFilter<T>;

function withFilter<T>(
  array: T[]
): (filter: (value: T) => boolean) => WithFilter<T>;

function withFilter<T>(array: T[], filter?: (value: T) => boolean) {
  if (filter) {
    return new WithFilter(array, filter);
  }

  return (filter: (value: T) => boolean) => new WithFilter(array, filter);
}

export default withFilter;
