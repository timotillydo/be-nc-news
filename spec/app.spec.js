process.env.NODE_ENV = "test";

const app = require("../app");
const request = require("supertest")(app);
const chai = require("chai");
const { expect } = chai;
chai.use(require("chai-sorted"));
const connection = require("../db/connection");

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

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
    describe("/users/:username", () => {
      it("returns a status code: 200 and an array of one user by their username", () => {
        return request
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).to.have.keys("username", "name", "avatar_url");
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
      it("returns a status code: 200 and an array of article objects requested", () => {
        return request
          .get("/api/articles/1")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.have.keys(
              "author",
              "title",
              "article_id",
              "body",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
            expect(articles.comment_count).to.equal("13");
          });
      });
      it("returns a status code: 404 and error message when requesting a valid article_id that doesn't exist in the table", () => {
        return request
          .get("/api/articles/888888")
          .expect(404)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 404: Article_id 888888 Not Found");
          });
      });
      it("returns a status code: 400 and error message when requesting an invalid article_id", () => {
        return request
          .get("/api/articles/invalidId")
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
    });
    describe("/articles/:article_id/comments", () => {
      it("returns a status code: 200 and an array of all comments for a valid article_id", () => {
        return request
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.have.length(13);
            comments.forEach(comment => {
              expect(comment).to.have.keys(
                "comment_id",
                "votes",
                "created_at",
                "author",
                "body",
                "article_id"
              );
            });
          });
      });
      it("returns a status code: 200 and an array of comments default sorted by created_at key in descending order when requested without a sort_by query", () => {
        return request
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.sortedBy("created_at", { descending: true });
          });
      });
      it("returns a status code: 200 and an array of comments sorted by sort_by value passed with query default sorted in descending order", () => {
        return request
          .get("/api/articles/1/comments?sort_by=votes")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.sortedBy("votes", { descending: true });
          });
      });
      it("returns a status code: 200 and an array of comments default sorted by created_at key and ascending in order when queried with order=asc", () => {
        return request
          .get("/api/articles/1/comments?order=asc")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.sortedBy("created_at", {
              descending: false
            });
          });
      });
      it("returns a status code: 404 and error message when request sent for all comments belonging to an article_id that doesn't exist", () => {
        return request
          .get("/api/articles/8888888/comments")
          .expect(404)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 404: Resource Not Found");
          });
      });
      it("returns a status code: 400 and an error message when request sent for all comments with an invalid datatype as the article_id", () => {
        return request
          .get("/api/articles/invalidId/comments")
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
      it("returns a status code: 400 when sent a request with an invalid sort_by query value", () => {
        return request
          .get("/api/articles/comments?sort_by=invalid_value")
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
      it("returns a status code: 400 when sent a request with an invalid order query value", () => {
        return request
          .get("/api/articles/comments?order=invalid_order")
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
      it("returns a status code: 400 when sent a request with an invalid query key", () => {
        return request
          .get("/api/articles/comments?invalid_query=hello")
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
    });
    describe("/articles", () => {
      it("returns a status code: 200 and an array of all articles with key comment_count included in each article object", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            articles.forEach(article => {
              expect(article).to.have.keys(
                "author",
                "title",
                "article_id",
                "topic",
                "body",
                "created_at",
                "votes",
                "comment_count"
              );
            });
          });
      });
    });
  });
  describe("PATCH requests", () => {
    describe("/articles/:article_id", () => {
      it("returns status code: 200 and the updated article when request sent (with update data in body) to update an article by it's id", () => {
        return request
          .patch("/api/articles/1")
          .send({ inc_votes: 22 })
          .expect(200)
          .then(({ body: { updatedArticle } }) => {
            expect(updatedArticle).to.have.keys(
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at"
            );
            expect(updatedArticle.votes).to.equal(122);
          });
      });
      it("returns a status code: 404 and error message when patching a valid article_id that doesn't exist in the table", () => {
        return request
          .patch("/api/articles/888888")
          .send({ inc_votes: 13 })
          .expect(404)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 404: Article_id 888888 Not Found");
          });
      });
      it("returns a status code: 400 and error message when request sent for an invalid article_id", () => {
        return request
          .patch("/api/articles/invalidId")
          .send({ inc_votes: 13 })
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
      it("returns status code: 400 and error message when a request is sent to a valid path with a body with a column that doesn't exist", () => {
        return request
          .patch("/api/articles/1")
          .send({ invalid_column: "hello this is data" })
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Malformed Body");
          });
      });
      it("returns a status code: 400 and an error message when a request is sent  to a valid path where the body has a correct column header key but invalid data", () => {
        return request
          .patch("/api/articles/1")
          .send({ inc_votes: "hello this is invalid data" })
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
      it("returns a status code: 400 and an error message when a request is sent to a valid path where the body has an extra key", () => {
        return request
          .patch("/api/articles/1")
          .send({ inc_votes: 20, extra_key: "hello" })
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Malformed Body");
          });
      });
      it("returns a status code: 400 and an error message when a request is sent to a valid path but without a body", () => {
        return request
          .patch("/api/articles/1")
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Malformed Body");
          });
      });
    });
  });
  describe("POST requests", () => {
    describe("/articles/:article_id/comments", () => {
      it("returns status code: 201 and the new row that has been posted", () => {
        return request
          .post("/api/articles/1/comments")
          .send({ username: "lurker", body: "that article was great!" })
          .expect(201)
          .then(({ body: { comment } }) => {
            expect(comment).to.have.keys(
              "body",
              "comment_id",
              "author",
              "article_id",
              "votes",
              "created_at"
            );
            expect(comment.author).to.equal("lurker");
            expect(comment.body).to.equal("that article was great!");
          });
      });
      it("returns a status code: 404 and error message when request sent for a valid id but the article_id doesn't exist", () => {
        return request
          .post("/api/articles/12345/comments")
          .send({ username: "lurker", body: "that article was great!" })
          .expect(422)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 422: Unprocessable Entity");
          });
      });
      it("returns a status code: 400 and error message when request sent for an invalid article_id datatype", () => {
        return request
          .post("/api/articles/invalidId/comments")
          .send({ username: "lurker", body: "that article was great!" })
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
      it("returns a status code: 400 and error message when request sent without body", () => {
        return request
          .post("/api/articles/1/comments")
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
      it("returns a status code: 400 and error message when request sent with a body with an invalid column header key", () => {
        return request
          .post("/api/articles/1/comments")
          .send({
            username: "lurker",
            invalid_column: "that article was great!"
          })
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
      it("returns a status code: 400 and error message when request sent with a body with an valid column header key but the datatype is invalid for that column", () => {
        return request
          .post("/api/articles/1/comments")
          .send({
            username: 123456789,
            invalid_column: "that article was great!"
          })
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
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
