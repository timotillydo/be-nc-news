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
    const expectedResult = [
      { created_at: new Date(1416140514171) },
      { created_at: new Date(1403143051) },
      { created_at: new Date(1203143051) },
      { created_at: new Date(1542284514171) }
    ];
    expect(actualResult).to.eql(expectedResult);
  });
});

describe("makeRefObj", () => {
  it("should return an empty object when passed an empty array", () => {
    expect(makeRefObj([])).to.eql({});
  });
  it("should return an object with a key and value corressponding to the title and id keys from the one object in the array passed to the function", () => {
    const input = [{ title: "This is a title", article_id: 1 }];
    const refKey = "title";
    const refValue = "article_id";
    const actualResult = makeRefObj(input, refKey, refValue);
    expect(actualResult).to.eql({ "This is a title": 1 });
  });
  it("should return a reference object when passed an array of multiple objects and the desired refKey and refValue values", () => {
    const input = [
      { title: "Living in the shadow of a great man", article_id: 1 },
      { title: "Eight pug gifs that remind me of mitch", article_id: 2 },
      { title: "Student SUES Mitch!", article_id: 3 }
    ];
    const refKey = "title";
    const refValue = "article_id";
    const actualResult = makeRefObj(input, refKey, refValue);
    const expectedResult = {
      "Living in the shadow of a great man": 1,
      "Eight pug gifs that remind me of mitch": 2,
      "Student SUES Mitch!": 3
    };
    expect(actualResult).to.eql(expectedResult);
  });
});

describe("formatComments", () => {
  it("should return an empty array when passed an empty array", () => {
    expect(formatComments([])).to.eql([]);
  });
  it("should return an array of one comment object with its 'created_by' key renamed to 'author'", () => {
    const comments = [{ created_by: "butter_bridge" }];
    const actualResult = formatComments(comments);
    const expectedResult = [{ author: "butter_bridge" }];
    expect(actualResult).to.eql(expectedResult);
  });
  it("should return an array of one comment object with it's 'belongs_to' key renamed to 'article_id' and it's value should be the corresponding id", () => {
    const comments = [{ belongs_to: "They're not exactly dogs, are they?" }];
    const refObj = { "They're not exactly dogs, are they?": 3 };
    const actualResult = formatComments(comments, refObj);
    const expectedResult = [{ article_id: 3 }];
    expect(actualResult).to.eql(expectedResult);
  });
  it("should return an array with one comment object that has it's created_at value converted into a javascript date object", () => {
    const comments = [{ created_at: 1511354163389 }];
    const actualResult = formatComments(comments);
    const expectedResult = [{ created_at: new Date(1511354163389) }];
    expect(actualResult).to.eql(expectedResult);
  });
  it("should return an array of multiple formatted objects with all non-formatted keys maintained, when passed an array of multiple comment objects", () => {
    const comments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 100,
        created_at: 1448282163389
      },
      {
        body: " I carry a log — yes. Is it funny to you? It is not to me.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: -100,
        created_at: 1416746163389
      }
    ];
    const refObj = {
      "They're not exactly dogs, are they?": 3,
      "Living in the shadow of a great man": 4
    };
    const actualResult = formatComments(comments, refObj);
    const expectedResult = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 3,
        author: "butter_bridge",
        votes: 16,
        created_at: new Date(1511354163389)
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 4,
        author: "butter_bridge",
        votes: 14,
        created_at: new Date(1479818163389)
      },
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        article_id: 4,
        author: "icellusedkars",
        votes: 100,
        created_at: new Date(1448282163389)
      },
      {
        body: " I carry a log — yes. Is it funny to you? It is not to me.",
        article_id: 4,
        author: "icellusedkars",
        votes: -100,
        created_at: new Date(1416746163389)
      }
    ];
    expect(actualResult).to.eql(expectedResult);
  });
});
