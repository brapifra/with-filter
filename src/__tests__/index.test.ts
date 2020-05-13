import * as fc from "fast-check";
import withFilter from "..";

const integerArrayArbitrary = fc.array(fc.integer());
const generateFilter = (value: boolean) => jest.fn(() => value);

describe("withFilter", () => {
  test("should be curried", () => {
    const thirdFilterArb = fc.boolean().map((value) => generateFilter(value));
    const property = fc.property(
      integerArrayArbitrary,
      thirdFilterArb,
      (array, thirdFilter) => {
        const [firstFilter, secondFilter] = [
          generateFilter(true),
          generateFilter(true),
        ];

        expect(
          withFilter(array, firstFilter)
            .withFilter(secondFilter)
            .withFilter(thirdFilter)
            .map((value) => value)
        ).toEqual(
          withFilter(array)(firstFilter)
            .withFilter(secondFilter)
            .withFilter(thirdFilter)
            .map((value) => value)
        );
      }
    );

    fc.assert(property);
  });
});

describe("WithFilter", () => {
  it("each filter should be called [array.length] times if all filters return true", () => {
    const property = fc.property(integerArrayArbitrary, (array) => {
      const [firstFilter, secondFilter, thirdFilter] = [
        generateFilter(true),
        generateFilter(true),
        generateFilter(true),
      ];

      withFilter(array, firstFilter)
        .withFilter(secondFilter)
        .withFilter(thirdFilter)
        .map((value) => value);

      expect(firstFilter).toBeCalledTimes(array.length);
      expect(secondFilter).toBeCalledTimes(array.length);
      expect(thirdFilter).toBeCalledTimes(array.length);
    });

    fc.assert(property);
  });

  it("next filters shouldn't be called if the previous filter returned false", () => {
    const property = fc.property(integerArrayArbitrary, (array) => {
      const [firstFilter, secondFilter, thirdFilter] = [
        generateFilter(true),
        generateFilter(false),
        generateFilter(true),
      ];

      withFilter(array, firstFilter)
        .withFilter(secondFilter)
        .withFilter(thirdFilter)
        .map((value) => value);

      expect(firstFilter).toBeCalledTimes(array.length);
      expect(secondFilter).toBeCalledTimes(array.length);
      expect(thirdFilter).not.toBeCalled();
    });

    fc.assert(property);
  });

  describe("array methods", () => {
    const firstFilter = (value: number) => value > 0;
    const secondFilter = (value: number) => value < Number.MAX_VALUE;

    it("should only map over filtered values", () => {
      const property = fc.property(integerArrayArbitrary, (array) => {
        const mapper = (value: number) => value * -1;

        const result = withFilter(array, firstFilter)
          .withFilter(secondFilter)
          .map(mapper);

        expect(result).toEqual(
          array.filter(firstFilter).filter(secondFilter).map(mapper)
        );
      });

      fc.assert(property);
    });

    it("should loop over filtered values when using forEach", () => {
      const property = fc.property(integerArrayArbitrary, (array) => {
        withFilter(array, firstFilter)
          .withFilter(secondFilter)
          .forEach((value) => {
            expect(firstFilter(value) && secondFilter(value)).toBe(true);
          });
      });

      fc.assert(property);
    });

    it("should only reduce over filtered values", () => {
      const property = fc.property(integerArrayArbitrary, (array) => {
        const result = withFilter(array, firstFilter)
          .withFilter(secondFilter)
          .reduce((acc, value) => acc + value, "");

        expect(result).toEqual(
          array.filter(firstFilter).filter(secondFilter).join("")
        );
      });

      fc.assert(property);
    });
  });

  describe("filters shouldn't be called unless", () => {
    const getFilters = () => [
      generateFilter(true),
      generateFilter(true),
      generateFilter(true),
    ];

    it(".map is called", () => {
      const property = fc.property(integerArrayArbitrary, (array) => {
        const [firstFilter, secondFilter, thirdFilter] = getFilters();

        const arrayWithFilters = withFilter(array, firstFilter)
          .withFilter(secondFilter)
          .withFilter(thirdFilter);

        expect(firstFilter).not.toBeCalled();
        expect(secondFilter).not.toBeCalled();
        expect(thirdFilter).not.toBeCalled();

        arrayWithFilters.map(() => {});

        expect(firstFilter).toBeCalledTimes(array.length);
        expect(secondFilter).toBeCalledTimes(array.length);
        expect(thirdFilter).toBeCalledTimes(array.length);
      });

      fc.assert(property);
    });

    it(".forEach is called", () => {
      const property = fc.property(integerArrayArbitrary, (array) => {
        const [firstFilter, secondFilter, thirdFilter] = getFilters();

        const arrayWithFilters = withFilter(array, firstFilter)
          .withFilter(secondFilter)
          .withFilter(thirdFilter);

        expect(firstFilter).not.toBeCalled();
        expect(secondFilter).not.toBeCalled();
        expect(thirdFilter).not.toBeCalled();

        arrayWithFilters.forEach(() => {});

        expect(firstFilter).toBeCalledTimes(array.length);
        expect(secondFilter).toBeCalledTimes(array.length);
        expect(thirdFilter).toBeCalledTimes(array.length);
      });

      fc.assert(property);
    });

    it(".reduce is called", () => {
      const property = fc.property(integerArrayArbitrary, (array) => {
        const [firstFilter, secondFilter, thirdFilter] = getFilters();

        const arrayWithFilters = withFilter(array, firstFilter)
          .withFilter(secondFilter)
          .withFilter(thirdFilter);

        expect(firstFilter).not.toBeCalled();
        expect(secondFilter).not.toBeCalled();
        expect(thirdFilter).not.toBeCalled();

        arrayWithFilters.reduce(() => ({}), {});

        expect(firstFilter).toBeCalledTimes(array.length);
        expect(secondFilter).toBeCalledTimes(array.length);
        expect(thirdFilter).toBeCalledTimes(array.length);
      });

      fc.assert(property);
    });
  });
});
