const express = require('express');
const db = require('./data/db');
const cors = require("cors");
const server = express();

server.get('/', (req, res) => {
    res.send('Hello from Express');
});

server.get('/api/users', (req, res) => {
    db
        .find()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((err) => {
            res.status(500).json({message: "server error"});
        });
});

server.post("/api/users/", (req, res) => {
    if (!req.body.name || !req.body.bio) {
      res
        .status(400)
        .json({ message: "Provide a name and bio." });
    } else
      db.insert(req.body)
        .then(newUser => res.status(201).json(newUser))
        .catch(err =>
          res
            .status(500)
            .json({
              message: "There was an error while saving."
            })
        );
  });

server.get('/api/users/:id', (req, res) => {
	const { id } = req.params;

	db
		.findById(id)
		.then((user) => {
			if (user) {
				res.status(200).json(user);
			} else {
				res.status(404).json({ message: `User not found.` });
			}
		})
		.catch((err) => res.status(500).json({ message: `Can't get user data.` }));
});

server.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
  
    db.remove(id)
      .then(user => {
        if (!user)
          res
            .status(404)
            .json({ message: "Specified user with ID does not exist." });
        else res.json(user);
      })
      .catch(err =>
        res.status(500).json({ message: "The user could not be removed." })
      );
  });

  server.put("/api/users/:id", (req, res) => {
    const { id } = req.params;
  
    if (!req.body.name && !req.body.bio) {
      console.log("Wrong info");
      res
        .status(400)
        .json({ errorMessage: "Provide a name or bio." });
    } else
      db.update(id, req.body)
        .then(user => {
          console.log("In request");
          if (!user)
            res
              .status(404)
              .json({
                message: "Specified user with ID does not exist."
              });
          res.json(user);
        })
        .catch(err =>
          res
            .status(500)
            .json({ error: "Could not be modified." })
        );
  });

server.listen(8000, () => console.log('Server running on http://localhost:8000')
);