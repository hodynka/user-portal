var express = require('express');
var router = express.Router();


const usersService = {
  users: [{ id: "u123123", name: "vasia", email: "vasia@gmail.com" }],
  createUser: function (user) {
    console.log('user1: ' + user)
    user.id = 'u' + Math.ceil((Math.random() * 1000000))

    console.log('this.users: ' + this.users)
    console.log('user2: ' + user)
    this.users.push(user)
    return user
  },
  deleteUser: function (id) {
    const rest = this.users.filter((user) => user.id !== id )
    if (rest.length < this.users.length) {
      this.users = rest
      return true
    } else {
      return false
    }
  },
  updateUser: function (id, user) {
    const userIndexId = this.users.findIndex((user) => user.id === id);
    console.log('this.users: ', this.users, '  id: ', id, '     userIndexId: ', userIndexId)
    if (userIndexId != -1) {
      this.users[userIndexId] = user
      return user
    }
    return null;  // todo: throw exception
  },
  getUsers: function () { console.log(this.users); return this.users },
  getUserDetails: function (id) {
    return this.users.find((user) => user.id === id )
  }
}


/* GET all users */
router.get('/', (req, resp, next) => {
  const users = usersService.getUsers()
  return resp.status(200).json(users)
});


/* Create user */
router.post('/', (req, resp, next) => {

  // validate user data
  const user = req.body
  if (user.name == null) {
    const error = { message: "user name is required"}
    return resp.status(400).json(error)
  }
  if (user.email == null) {
    const error = { message: "user email is required"}
    return resp.status(400).json(error)
  }

  // create
  const createdUser = usersService.createUser(user)
  return resp.status(200).json(createdUser)
});


/* Get user by id */
router.get('/:id', (req, resp, next) => {
  if (req.params.id != null) {
    const user = usersService.getUserDetails(req.params.id)
    if (user != null) {
      return resp.status(200).json(user)
    } else {
      const error = { message: "user not found"}
      return resp.status(404).json(error)
    }
  } else {
    const error = { message: "user id is required"}
    return resp.status(400).json(error)
  }
});


/* Update user by id */
router.put('/:id', (req, resp, next) => {
  if (req.params.id != null) {
    const updateResult = usersService.updateUser(req.params.id, req.body)
    if (updateResult != null) {
      return resp.status(200).json(updateResult)
    } else {
      const error = { message: "user not found"}
      return resp.status(404).json(error)
    }
  } else {
    const error = { message: "user id is required"}
    return resp.status(400).json(error)
  }
});


/* Delete user by id */
router.delete('/:id', (req, resp, next) => {
  if (req.params.id != null) {
    const deleteResult = usersService.deleteUser(req.params.id, )
    if (deleteResult) {
      return resp.status(200).json()
    } else {
      const error = { message: "user not found"}
      return resp.status(404).json(error)
    }
  } else {
    const error = { message: "user id is required"}
    return resp.status(400).json(error)
  }
});


module.exports = router;
