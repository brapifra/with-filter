export default class WithFilter<T> {
  constructor(private array: T[], private filter: (value: T) => boolean) {}

  withFilter(filter: (value: T) => boolean): WithFilter<T> {
    return new WithFilter(
      this.array,
      (value: T) => this.filter(value) && filter(value)
    );
  }

  map<N>(callbackfn: (value: T) => N): N[] {
    return this.array.reduce((acc, value) => {
      if (!this.filter(value)) {
        return acc;
      }

      return [...acc, callbackfn(value)];
    }, [] as N[]);
  }

  reduce<N>(callbackfn: (acc: N, value: T) => N, initialValue: N): N {
    return this.array.reduce((acc, value) => {
      if (!this.filter(value)) {
        return acc;
      }

      return callbackfn(acc, value);
    }, initialValue);
  }

  forEach(callbackfn: (value: T) => void): void {
    this.array.forEach((value) => {
      if (this.filter(value)) {
        callbackfn(value);
      }
    });
  }
}
