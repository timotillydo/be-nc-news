## All the built endpoints and methods for NC-News:

```http
GET /api
```
**Response:** A json representation of all the available endpoints of the api.

---

```http
GET /api/topics
```

**Response:** An array of topic objects, with the following properties:
  * `slug`
  * `description`

---

```http
GET /api/users
```

**Response:** A array of user objects, with the following properties:
  * `username`
  * `avatar_url`
  * `name`

---

```http
GET /api/users/:username
```

**Response:** A single user object, with the following properties:
  * `username`
  * `avatar_url`
  * `name`

---

```http
GET /api/articles
```

**Response:** An array of article objects, each of which should have the following properties:
  * `author`
  * `title`
  * `article_id`
  * `topic`
  * `created_at`
  * `votes`
  * `comment_count` - the total count of all the comments with this article_id.

**Queries:**

* `sort_by` - which allows for sorting by any property of an article, defaults to created_at property.
* `order` - defaults to descending.
* `author` - filters by username.
* `topic` - filters by topic.
* `limit` - which limits the number of responses, defaults to 10.
* `p` - the page at which to start.

---

```http
GET /api/articles/:article_id
```

**Response:** An article object, with the following properties:

  * `author`
  * `title`
  * `article_id`
  * `body`
  * `topic`
  * `created_at`
  * `votes`
  * `comment_count` - the total count of all the comments with this article_id.

---

```http
GET /api/articles/:article_id/comments
```

**Response:** An array of comments for the given `article_id`. Each comment should have the following properties:
  * `comment_id`
  * `votes`
  * `created_at`
  * `author`
  * `body`

**Queries:**

* `sort_by` - which allows for sorting by any property of a comment.
* `order` - defaults to descending.
* `limit` - which limits the number of responses, defaults to 10.
* `p` - the page at which to start.

---

```http
POST /api/topics
```

**Request Body:** Requires an object with the following properties:
  * `slug`
  * `description`

**Response:** The posted topic.

---

```http
POST /api/articles
```
**Request Body:** Requires an object with the following properties:
  * `author`
  * `title`
  * `body`
  * `topic`

**Response:** The posted article.

---

```http
POST /api/articles/:article_id/comments
```

**Request Body:** Requires an object with the following properties:
  * `username`
  * `body`

**Response:** The posted comment.

---

```http
POST /api/users
```

**Request Body:** Requires an object with the following properties:
  * `username`
  * `avatar_url`
  * `name`

**Response:** The posted user.

---

```http
PATCH /api/comments/:comment_id
```

**Request Body:** Requires an object in the form `{ inc_votes: newVote }`

  * `newVote` - the amount of votes to to increment by.

**Response:** The updated comment.

---

```http
PATCH /api/articles/:article_id
```

**Request Body:** Requires an object in the form `{ inc_votes: newVote }`

  * `newVote` - the amount of votes to to increment by. 

**Response:** The updated article.

---

```http
DELETE /api/comments/:comment_id
```

* Delete the given comment by it's `comment_id`.

**Response:** Status 204 and No Content

---

```http
DELETE /api/comments/:article_id
```

* Delete the given article by it's `article_id`.

**Response:** Status 204 and No Content

---