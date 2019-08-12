const express = require("express");

// database access using knex
const db = require("../data/db-config.js");

const router = express.Router();

router.get("/", (req, res) => {
  const { limit, orderby } = req.query;
  const query = db.select("*");

  if (limit) {
    query.limit(limit);
  }

  if (orderby) {
    query.orderBy(orderby);
  }

  query
    .from("posts")
    //db('posts')
    .then(results => {
      res.status(200).json(results);
    })
    .catch(error => {
      res.status(500).json({ message: "Errors getting the posts from the db" });
    });
});

router.get("/:id", (req, res) => {
  const postId = req.params.id;
  db("posts")
    .where({ id: postId })
    .first()
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      res.status(500).json({ message: "Error getting post by ID" });
    });
});

router.post("/", (req, res) => {
  const post = req.body;
  db("posts")
    .insert(post, "id")
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      res
        .status(500)
        .json({ message: "There was a problem adding your post to the db" });
    });
});

router.put("/:id", (req, res) => {
  const changes = req.body;
  db("posts")
    .where("id", "=", req.params.id)
    .update(changes)
    .then(count => {
      if (count) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ message: "There was a problem adding your post to the db" });
    });
});

router.delete("/:id", (req, res) => {
  db("posts")
    .where("id", "=", req.params.id)
    .del()
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      res
        .status(500)
        .json({ message: "There was a problem adding your post to the db" });
    });
});

module.exports = router;
