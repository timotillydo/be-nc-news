process.env.NODE_ENV = "test";

const app = require("../app");
const request = require("supertest")(app);
const chai = require("chai");
const { expect } = chai;
const connection = require("../db/connection");

describe("/api", () => {
  after(() => {
    connection.destroy();
  });
  describe("GET requests", () => {
    describe("/topics", () => {
      it("returns a status code: 200 and an array of all topics", () => {
        return request
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics).to.have.length(3);
            expect(topics[0]).to.have.keys("slug", "description");
          });
      });
    });
  });
});

describe("error handling request to invalid/unbuilt endpoint", () => {
  it("returns status code: 404 and error message: Route Not Found", () => {
    return request
      .get("/api/tooooopics")
      .expect(404)
      .then(({ body: { errMsg } }) => {
        expect(errMsg).to.equal("Error 404: Route Not Found");
      });
  });
});
