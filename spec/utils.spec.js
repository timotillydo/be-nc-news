const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("should return an array when passed an empty array", () => {
    expect(formatDates([])).to.eql([]);
  });
  it("should return an array with a single object which has it's: created_at timestamp value formatted correctly when passed an array with one object which can have any unix timestamp as the value of the created_at key", () => {
    let inputArray = [{ created_at: 0 }];
    let actualResult = formatDates(inputArray);
    expect(actualResult[0].created_at).to.eql(new Date(0));
    inputArray = [{ created_at: 1542284514171 }];
    actualResult = formatDates(inputArray);
    expect(actualResult[0].created_at).to.eql(new Date(1542284514171));
    inputArray = [{ created_at: 1416140514171 }];
    actualResult = formatDates(inputArray);
    expect(actualResult[0].created_at).to.eql(new Date(1416140514171));
  });
  it("should return an array of objects with each created_at key on each object formatted correctly when passed an array of multiple objects", () => {
    const inputArray = [
      { created_at: 1416140514171 },
      { created_at: 1403143051 },
      { created_at: 1203143051 },
      { created_at: 1542284514171 }
    ];
    const actualResult = formatDates(inputArray);
    const inputCopy = [
      { created_at: 1416140514171 },
      { created_at: 1403143051 },
      { created_at: 1203143051 },
      { created_at: 1542284514171 }
    ];
    const expectedResult = [
      { created_at: new Date(1416140514171) },
      { created_at: new Date(1403143051) },
      { created_at: new Date(1203143051) },
      { created_at: new Date(1542284514171) }
    ];
    expect(actualResult).to.eql(expectedResult);
    expect(actualResult).to.not.equal(expectedResult);
  });
});
