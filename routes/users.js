const express = require('express');

const router = express.Router();

const dummyUsers = [
  {
    id: 123,
    name: 'Bill',
    age: 31
  }
];

router.get('/:uid', (req, res, next) => {
  const userId = req.params.uid;
  const user = dummyUsers.find((element) => {
    return element.id === userId;
  });
  res.json({ user });
});

module.exports = router;
