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
    describe("/api", () => {
      it("returns a status code: 200 and a json of all available endpoints", () => {
        return request
          .get("/api")
          .expect(200)
          .then(({ body: { ncnewsapi } }) => {
            expect(ncnewsapi).to.have.keys("GET", "POST", "PATCH", "DELETE");
          });
      });
    });
    describe("/topics", () => {
      it("returns a status code: 200 and an array of all topics", () => {
        return request
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics).to.have.length(3);
            topics.forEach(topic => {
              expect(topic).to.have.keys("slug", "description");
            });
          });
      });
    });
    describe("/users", () => {
      it("returns a status code: 200 and an array of all users", () => {
        return request
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users).to.have.length(4);
            users.forEach(user => {
              expect(user).to.have.keys("username", "avatar_url", "name");
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
      it("returns a status code: 200 and an array of articles default sorted by created_at when not passed a sort_by query value, also default sorted in descending order", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy("created_at", { descending: true });
          });
      });
      it("returns a status code: 200 and an array of articles sorted by any valid sort_by value passed with query default sorted in descending order", () => {
        return request
          .get("/api/articles?sort_by=votes")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy("votes", { descending: true });
          });
      });
      it("returns a status code: 200 and an array of articles default sorted by created_at key and ascending in order when queried with order=asc", () => {
        return request
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy("created_at", {
              descending: false
            });
          });
      });
      it("returns a status code: 400 when sent a request with an invalid sort_by query value", () => {
        return request
          .get("/api/articles?sort_by=invalid_value")
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
      it("returns a status code: 400 when sent a request with an invalid order query value", () => {
        return request
          .get("/api/articles?order=invalid_order")
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
      it("returns a status code: 200 when sent a request with an invalid query key", () => {
        return request
          .get("/api/articles?invalid_query=hello")
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
      it("returns a status code: 200 and an array of article objects, default sorted/ordered, filtered by author if queried with a valid author", () => {
        return request
          .get("/api/articles?author=icellusedkars")
          .expect(200)
          .then(({ body: { articles } }) => {
            articles.forEach(article => {
              expect(article.author).to.equal("icellusedkars");
            });
            expect(articles).to.be.sortedBy("created_at", {
              descending: true
            });
          });
      });
      it("returns a status code: 200 and an array of article objects, default sorted/ordered, filtered by topic if queried with a valid topic", () => {
        return request
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            articles.forEach(article => {
              expect(article.topic).to.equal("mitch");
            });
            expect(articles).to.be.sortedBy("created_at", {
              descending: true
            });
          });
      });
      it("returns a status code: 404 and an error message when queried with a valid topic but it doesn't exist", () => {
        return request
          .get("/api/articles?topic=not-a-topic")
          .expect(404)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 404: Resource Not Found");
          });
      });
      it("returns a status code: 400 when sent a request with an invalid author query value", () => {
        return request
          .get("/api/articles?author=not-an-author")
          .expect(404)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 404: Resource Not Found");
          });
      });
      it("returns a status code: 200 and a default limit of 10 articles when request sent without a limit query", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.have.length(10);
          });
      });
      it("returns a status code: 200 and a custom limit of articles when request sent with a limit query", () => {
        return request
          .get("/api/articles?limit=11")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.have.length(11);
          });
      });
      it("returns a status code: 200 and a specific array of articles depending on the page number queried", () => {
        return request
          .get("/api/articles?p=2")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].article_id).to.equal(11);
          });
      });
      it("returns a status code: 200 and a specific array of articles depending on the combined custom limit and page number queried", () => {
        return request
          .get("/api/articles?limit=3&p=3")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].article_id).to.equal(7);
          });
      });
      it("returns a status code: 200, a total_count property and an array of articles ", () => {
        const paths = [
          "/api/articles",
          "/api/articles?author=icellusedkars",
          "/api/articles?topic=mitch",
          "/api/articles?author=icellusedkars&topic=mitch"
        ];
        const promises = paths.map(path => {
          return request
            .get(`${path}`)
            .expect(200)
            .then(({ body }) => {
              expect(body).to.have.keys("total_count", "articles");
            });
        });
        return Promise.all(promises);
      });
    });
    describe("/articles/:article_id", () => {
      it("returns a status code: 200 and an article object requested", () => {
        return request
          .get("/api/articles/1")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).to.have.keys(
              "author",
              "title",
              "article_id",
              "body",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
            expect(article.comment_count).to.equal("13");
          });
      });
      it("returns a status code: 404 and error message when requesting a valid article_id that doesn't exist in the table", () => {
        return request
          .get("/api/articles/888888")
          .expect(404)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 404: Resource Not Found");
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
      it("returns a status code: 200 and an array of all comments for a valid article_id with a total_count key for the number of comment associated with the article_id provided", () => {
        return request
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { total_count } }) => {
            expect(total_count).to.equal(13);
          });
      });
      it("returns a status code: 200 and an empty array for a valid article_id without any comments", () => {
        return request
          .get("/api/articles/2/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.eql([]);
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
          .get("/api/articles/1/comments?sort_by=invalid_value")
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
      it("returns a status code: 400 when sent a request with an invalid order query value", () => {
        return request
          .get("/api/articles/1/comments?order=invalid_order")
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
      it("returns a status code: 200 when sent a request with an invalid query key", () => {
        return request
          .get("/api/articles/1/comments?invalid_query=hello")
          .expect(200);
      });
      it("returns a status code: 200 and a default limit of 10 comments when request sent without a limit query", () => {
        return request
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.have.length(10);
          });
      });
      it("returns a status code: 200 and a custom limit of comments when request sent with a limit query", () => {
        return request
          .get("/api/articles/1/comments?limit=4")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.have.length(4);
          });
      });
      it("returns a status code: 200 and a specific array of comments depending on the page number queried", () => {
        return request
          .get("/api/articles/1/comments?limit=10&p=2")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments[0].comment_id).to.equal(12);
          });
      });
      it("returns a status code: 200 and a specific array of comments depending on the combined custom limit and page number queried", () => {
        return request
          .get("/api/articles/1/comments?limit=3&p=3")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments[0].comment_id).to.equal(8);
          });
      });
      it("returns a status code: 200, a total_count property and an array of comments ", () => {
        const paths = [
          "/api/articles/1/comments",
          "/api/articles/2/comments",
          "/api/articles/3/comments",
          "/api/articles/4/comments"
        ];
        const promises = paths.map(path => {
          return request
            .get(`${path}`)
            .expect(200)
            .then(({ body }) => {
              expect(body).to.have.keys("total_count", "comments");
            });
        });
        return Promise.all(promises);
      });
    });
  });
  describe("PATCH requests", () => {
    describe("/articles/:article_id", () => {
      it("returns a status code: 200 and the updated article when request sent (with update data in body) to update an article by it's id", () => {
        return request
          .patch("/api/articles/1")
          .send({ inc_votes: 22 })
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).to.have.keys(
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at"
            );
            expect(article.votes).to.equal(122);
          });
      });
      it("returns a status code: 404 and error message when patching a valid article_id but doesn't exist in the table", () => {
        return request
          .patch("/api/articles/888888")
          .send({ inc_votes: 13 })
          .expect(404)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 404: Resource Not Found");
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
      it("returns a status code: 400 and an error message when a request is sent to a valid path where the body has a correct column header key but invalid data", () => {
        return request
          .patch("/api/articles/1")
          .send({ inc_votes: "hello this is invalid data" })
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
      it("returns a status code: 200 and an unchanged article when a request is sent to a valid path but without a body", () => {
        return request
          .patch("/api/articles/1")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).to.have.keys(
              "article_id",
              "title",
              "topic",
              "author",
              "body",
              "created_at",
              "votes"
            );
            expect(article.votes).to.equal(100);
          });
      });
    });
    describe("/comments/:comment_id", () => {
      it("returns a status code: 200 and a copy of the the updated comment when requested with a valid body", () => {
        return request
          .patch("/api/comments/1")
          .send({ inc_votes: 33 })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment).to.have.keys(
              "comment_id",
              "author",
              "article_id",
              "votes",
              "created_at",
              "body"
            );
            expect(comment.votes).to.equal(49);
          });
      });
      it("returns a status code: 404 and error message when patching a valid comment_id but doesn't exist in the table", () => {
        return request
          .patch("/api/comments/77777")
          .send({ inc_votes: 777 })
          .expect(404)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 404: Resource Not Found");
          });
      });
      it("returns a status code: 400 and error message when request sent with an invalid comment_id", () => {
        return request
          .patch("/api/comments/invalidId")
          .send({ inc_votes: 777 })
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
      it("returns a status code: 400 and an error message when a request is sent to a valid path where the body has a correct column header key but invalid data", () => {
        return request
          .patch("/api/comments/1")
          .send({ inc_votes: "invalid data" })
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
      it("returns a status code: 200 and an unchanged comment when a request is sent to a valid path but without a body", () => {
        return request
          .patch("/api/comments/1")
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment).to.have.keys(
              "comment_id",
              "article_id",
              "author",
              "body",
              "created_at",
              "votes"
            );
            expect(comment.votes).to.equal(16);
          });
      });
    });
  });
  describe("POST requests", () => {
    describe("/articles", () => {
      it("returns a status code: 201 and the new article row that has been posted", () => {
        return request
          .post("/api/articles")
          .send({
            title:
              "Trump to Miners, Loggers and Drillers: This Land Is Your Land",
            topic: "paper",
            author: "lurker",
            body:
              "The tug-of-war over America’s public lands between those who would protect them for future generations and those who would exploit them for immediate commercial gain has a long history. The two Roosevelts, Richard Nixon, Jimmy Carter and Bill Clinton were mostly sympathetic to the cause of conservation, Ronald Reagan and the second George Bush decidedly less so. But for sheer hostility to environmental values, Donald Trump has no equal. Mr.Trump arrived in the White House with little interest in conservation, his idea of nature framed largely by his golf courses.He was, to boot, almost pathologically dedicated to obliterating anything President Obama had done to reduce global warming gases, preserve open space and help endangered species. This translated into a simple operating strategy: Get rid of things the fossil fuel industry didn’t like and rubber- stamp the stuff it wanted. Hence the rollback of Obama rules limiting power plant emissions of greenhouse gases, and the proposed rollback of regulations governing methane, a powerful global warming gas. (Next up, it seems certain, is the reversal of Obama rules mandating more fuel - efficient vehicles.) Hence also the gifts over the last two years to mining and oil and gas interests of vast areas previously shielded from exploration — two national monuments in Utah, millions of acres reserved for the threatened sage grouse, much of the outer continental shelf and the long - protected coastal plain of the Arctic National Wildlife Refuge.",
            created_at: new Date(1567284192)
          })
          .expect(201)
          .then(({ body: { article } }) => {
            expect(article).to.have.keys(
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at"
            );
          });
      });
      it("returns a status code: 400 and error message when post request sent without body", () => {
        return request
          .post("/api/articles")
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
      it("returns a status code: 400 and error message when post request sent with a body with an invalid column header key", () => {
        return request
          .post("/api/articles")
          .send({
            title:
              "Trump to Miners, Loggers and Drillers: This Land Is Your Land",
            topic: "paper",
            penguin: "lurker",
            body:
              "The tug-of-war over America’s public lands between those who would protect them for future generations and those who would exploit them for immediate commercial gain has a long history. The two Roosevelts, Richard Nixon, Jimmy Carter and Bill Clinton were mostly sympathetic to the cause of conservation, Ronald Reagan and the second George Bush decidedly less so. But for sheer hostility to environmental values, Donald Trump has no equal. Mr.Trump arrived in the White House with little interest in conservation, his idea of nature framed largely by his golf courses.He was, to boot, almost pathologically dedicated to obliterating anything President Obama had done to reduce global warming gases, preserve open space and help endangered species. This translated into a simple operating strategy: Get rid of things the fossil fuel industry didn’t like and rubber- stamp the stuff it wanted. Hence the rollback of Obama rules limiting power plant emissions of greenhouse gases, and the proposed rollback of regulations governing methane, a powerful global warming gas. (Next up, it seems certain, is the reversal of Obama rules mandating more fuel - efficient vehicles.) Hence also the gifts over the last two years to mining and oil and gas interests of vast areas previously shielded from exploration — two national monuments in Utah, millions of acres reserved for the threatened sage grouse, much of the outer continental shelf and the long - protected coastal plain of the Arctic National Wildlife Refuge.",
            created_at: new Date(1567284192)
          })
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
      it("returns a status code: 400 and error message when post request sent with a body with an valid column header key but the datatype is invalid for that column", () => {
        return request
          .post("/api/articles")
          .send({
            title:
              "Trump to Miners, Loggers and Drillers: This Land Is Your Land",
            topic: "paper",
            author: null,
            body:
              "The tug-of-war over America’s public lands between those who would protect them for future generations and those who would exploit them for immediate commercial gain has a long history. The two Roosevelts, Richard Nixon, Jimmy Carter and Bill Clinton were mostly sympathetic to the cause of conservation, Ronald Reagan and the second George Bush decidedly less so. But for sheer hostility to environmental values, Donald Trump has no equal. Mr.Trump arrived in the White House with little interest in conservation, his idea of nature framed largely by his golf courses.He was, to boot, almost pathologically dedicated to obliterating anything President Obama had done to reduce global warming gases, preserve open space and help endangered species. This translated into a simple operating strategy: Get rid of things the fossil fuel industry didn’t like and rubber- stamp the stuff it wanted. Hence the rollback of Obama rules limiting power plant emissions of greenhouse gases, and the proposed rollback of regulations governing methane, a powerful global warming gas. (Next up, it seems certain, is the reversal of Obama rules mandating more fuel - efficient vehicles.) Hence also the gifts over the last two years to mining and oil and gas interests of vast areas previously shielded from exploration — two national monuments in Utah, millions of acres reserved for the threatened sage grouse, much of the outer continental shelf and the long - protected coastal plain of the Arctic National Wildlife Refuge.",
            created_at: new Date(1567284192)
          })
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
    });
    describe("/articles/:article_id/comments", () => {
      it("returns a status code: 201 and the new comment row that has been posted", () => {
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
      it("returns a status code: 422 and error message when request sent for a valid id datatype but the article_id doesn't exist", () => {
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
      it("returns a status code: 400 and error message when post request sent without body", () => {
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
    describe("/topics", () => {
      it("returns a status code: 201 and a copy of the new topic sent to be posted", () => {
        return request
          .post("/api/topics")
          .send({ slug: "rainbows", description: "Colourful shtuff!" })
          .expect(201)
          .then(({ body: { topic } }) => {
            expect(topic).to.have.keys("slug", "description");
          });
      });
      it("returns a status code: 400 and error message when post request sent without body", () => {
        return request
          .post("/api/topics")
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
      it("returns a status code: 400 and error message when request sent with a body with an invalid column header key", () => {
        return request
          .post("/api/topics")
          .send({
            slug: "rainforests",
            invalid_column: "awesome!"
          })
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
      it("returns a status code: 400 and error message when request sent with a body with an extra key", () => {
        return request
          .post("/api/topics")
          .send({
            slug: "rainforests",
            description: "this is a great description",
            extra_key: "this should'nt work"
          })
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
    });
    describe("/users", () => {
      it("returns a status code: 201 and a copy of the new user posted", () => {
        return request
          .post("/api/users")
          .send({
            username: "greenfudge",
            avatar_url:
              "http://images-gmi-pmc.edge-generalmills.com/f01806b7-eca4-4953-83cc-4203eaff905d.jpg",
            name: "frank"
          })
          .then(({ body: { user } }) => {
            expect(user).to.have.keys("username", "avatar_url", "name");
          });
      });
      it("returns a status code: 400 and error message when post request sent without body", () => {
        return request
          .post("/api/users")
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
      it("returns a status code: 400 and error message when request sent with a body with an invalid column header key", () => {
        return request
          .post("/api/users")
          .send({
            username: "greenfudge",
            avatar_url:
              "http://images-gmi-pmc.edge-generalmills.com/f01806b7-eca4-4953-83cc-4203eaff905d.jpg",
            my_name: "frank"
          })
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
      it("returns a status code: 400 and error message when request sent with a body with an extra key", () => {
        return request
          .post("/api/users")
          .send({
            username: "greenfudge",
            avatar_url:
              "http://images-gmi-pmc.edge-generalmills.com/f01806b7-eca4-4953-83cc-4203eaff905d.jpg",
            name: "frank",
            extra_key: "extra extra"
          })
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
    });
  });
  describe("DELETE requests", () => {
    describe("/comments/:comment_id", () => {
      it("returns a status code: 204", () => {
        const comment_ids = [1, 2, 3, 4, 5, 6, 7, 8];
        const promises = comment_ids.map(comment_id => {
          request.delete(`/api/comments/${comment_id}`).expect(204);
        });
        return Promise.all(promises);
      });
      it("returns a status code: 404 and error message when request sent for a deletion of comment where the comment_id doesn't exist", () => {
        return request
          .delete("/api/comments/99999")
          .expect(404)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 404: Resource Not Found");
          });
      });
      it("returns a status code: 400 and error message when request sent for a deletion of comment where the comment_id doesn't exist", () => {
        return request
          .delete("/api/comments/qwwbdcflbqrlfbjh")
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
    });
    describe("/articles/:article_id", () => {
      it("returns a status code: 204 and can delete all comments referencing that article", () => {
        const article_ids = [1, 2, 3, 4, 5, 6, 7, 8];
        const promises = article_ids.map(article_id => {
          request.delete(`/api/articles/${article_id}`).expect(204);
        });
        return Promise.all(promises);
      });
      it("returns a status code: 404 and error message when request sent for a deletion of article where the article_id doesn't exist", () => {
        return request
          .delete("/api/articles/99999")
          .expect(404)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 404: Resource Not Found");
          });
      });
      it("returns a status code: 400 and error message when request sent for a deletion of article where the article_id doesn't exist", () => {
        return request
          .delete("/api/articles/qwwbdcflbqrlfbjh")
          .expect(400)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 400: Bad Request");
          });
      });
    });
  });

  describe("Misc Error Handling", () => {
    describe("Endpoint Not Valid", () => {
      it("returns a status code: 404 and error message: Route Not Found, when request sent to path that doesn't exist", () => {
        return request
          .get("/api/tooooopics")
          .expect(404)
          .then(({ body: { errMsg } }) => {
            expect(errMsg).to.equal("Error 404: Route Not Found");
          });
      });
    });
    describe("Invalid Method On Endpoint", () => {
      describe("/api", () => {
        it("returns a status code: 405 and error message: Method Not Allowed", () => {
          const invalidMethods = ["post", "put", "delete", "patch"];
          const methodPromises = invalidMethods.map(method => {
            return request[method]("/api")
              .expect(405)
              .then(({ body: { errMsg } }) => {
                expect(errMsg).to.equal("Error 405: Method Not Allowed");
              });
          });
          return Promise.all(methodPromises);
        });
        describe("/topics", () => {
          it("returns a status code: 405 and error message: Method Not Allowed", () => {
            const invalidMethods = ["put", "delete", "patch"];
            const methodPromises = invalidMethods.map(method => {
              return request[method]("/api/topics")
                .expect(405)
                .then(({ body: { errMsg } }) => {
                  expect(errMsg).to.equal("Error 405: Method Not Allowed");
                });
            });
            return Promise.all(methodPromises);
          });
        });
        describe("/articles", () => {
          it("returns a status code: 405 and error message: Method Not Allowed", () => {
            const invalidMethods = ["put", "delete", "patch"];
            const methodPromises = invalidMethods.map(method => {
              return request[method]("/api/articles")
                .expect(405)
                .then(({ body: { errMsg } }) => {
                  expect(errMsg).to.equal("Error 405: Method Not Allowed");
                });
            });
            return Promise.all(methodPromises);
          });
          describe("/:article_id", () => {
            it("returns a status code: 405 and error message: Method Not Allowed", () => {
              const invalidMethods = ["post", "put"];
              const methodPromises = invalidMethods.map(method => {
                return request[method]("/api/articles/:article_id")
                  .expect(405)
                  .then(({ body: { errMsg } }) => {
                    expect(errMsg).to.equal("Error 405: Method Not Allowed");
                  });
              });
              return Promise.all(methodPromises);
            });
          });
          describe("/:article_id/comments", () => {
            it("returns a status code: 405 and error message: Method Not Allowed", () => {
              const invalidMethods = ["put", "delete", "patch"];
              const methodPromises = invalidMethods.map(method => {
                return request[method]("/api/articles/:article_id/comments")
                  .expect(405)
                  .then(({ body: { errMsg } }) => {
                    expect(errMsg).to.equal("Error 405: Method Not Allowed");
                  });
              });
              return Promise.all(methodPromises);
            });
          });
        });
        describe("/users", () => {
          it("returns a status code: 405 and error message: Method Not Allowed", () => {
            const invalidMethods = ["put", "delete", "patch"];
            const methodPromises = invalidMethods.map(method => {
              return request[method]("/api/users")
                .expect(405)
                .then(({ body: { errMsg } }) => {
                  expect(errMsg).to.equal("Error 405: Method Not Allowed");
                });
            });
            return Promise.all(methodPromises);
          });
          describe("/users/:username", () => {
            it("returns a status code: 405 and error message: Method Not Allowed", () => {
              const invalidMethods = ["post", "put", "delete", "patch"];
              const methodPromises = invalidMethods.map(method => {
                return request[method]("/api/users/:username")
                  .expect(405)
                  .then(({ body: { errMsg } }) => {
                    expect(errMsg).to.equal("Error 405: Method Not Allowed");
                  });
              });
              return Promise.all(methodPromises);
            });
          });
        });
        describe("/comments/:comment_id", () => {
          it("returns a status code: 405 and error message: Method Not Allowed", () => {
            const invalidMethods = ["get", "post", "put"];
            const methodPromises = invalidMethods.map(method => {
              return request[method]("/api/comments/:comment_id")
                .expect(405)
                .then(({ body: { errMsg } }) => {
                  expect(errMsg).to.equal("Error 405: Method Not Allowed");
                });
            });
            return Promise.all(methodPromises);
          });
        });
      });
    });
  });
});
