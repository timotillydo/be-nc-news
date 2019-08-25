process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const chai = require("chai");
const { expect } = chai;
const connection = require("../db/connection");

describe("/api", () => {
  after(() => {
    connection.destroy();
  });
  describe("/topics", () => {
    describe("GET requests", () => {
      it("returns a status code: 200 and an array of all topics", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics).to.have.length(3);
          });
      });
    });
  });
});
