var express = require('express');
var router = express.Router();


const serverTimeout = 100

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
  setTimeout(() => {
    const users = usersService.getUsers()
    return resp.status(200).json(users)  
  }, serverTimeout)
});

function validateUserData(user) {
  if (user.name == null || user.name === '') {
    return { message: "user name is required"}
  }
  if (user.email == null || user.email === '') {
    return { message: "user email is required"}
  }
}

/* Create user */
router.post('/', (req, resp, next) => {

  setTimeout(() => {
    // validate user data
    const user = req.body

    const error = validateUserData(user)
    if (error) {
      console.log('error: ', error)
      return resp.status(400).json(error)
    }

    // create
    console.log('creating user: ', user)
    const createdUser = usersService.createUser(user)
    return resp.status(200).json(createdUser)
  }, serverTimeout + 100)

});


/* Get user by id */
router.get('/:id', (req, resp, next) => {
  setTimeout(() => {
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
  }, serverTimeout)
});


/* Update user by id */
router.put('/:id', (req, resp, next) => {
  setTimeout(() => {
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
  }, serverTimeout + 100)
});


/* Delete user by id */
router.delete('/:id', (req, resp, next) => {

  setTimeout(() => {
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
  }, serverTimeout + 100)
  
});


module.exports = router;
