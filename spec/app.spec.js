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
  describe("/users/:username", () => {
    it("returns a status code: 200 and an array of one user by their username", () => {
      return request
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user[0]).to.have.keys("username", "name", "avatar_url");
        });
    });
    it("returns a status code: 404 and a custom error message", () => {
      return request
        .get("/api/users/albert_einstein")
        .expect(404)
        .then(({ body: { errMsg } }) => {
          expect(errMsg).to.equal(
            "Error 404: Username albert_einstein Not Found"
          );
        });
    });
  });
  describe("/articles/:article_id", () => {
    it("returns a status code: 200 and an array of article requested", () => {
      return request
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article[0]).to.have.keys(
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
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
