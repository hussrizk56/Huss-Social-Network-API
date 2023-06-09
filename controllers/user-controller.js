const { User} = require('../models');

//User controller
const userController = {

    // get all users
    getAllUser(req, res) {
      User.find({})
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },

    // get one user by id
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({path: 'thoughts',select: '-__v'})
        .populate({path: 'friends',select: '-__v' })
        .select('-__v')
          .then(dbUserData => {
            // If no user found, send 404
            if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // createUser
    createUser({ body }, res) {
        User.create(body)
          .then(dbUserData => res.json(dbUserData))
          .catch(err => res.status(400).json(err));
    },

    // update user by id
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true ,runValidators: true })
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.status(400).json(err));
    },

    // delete user by id
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
          .then(dbUserData => {
            
            if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
            }
            console.log(dbUserData);
            res.json({message: 'User deleted successfully'});
            
            /*  // remove associated thoughts from this user
            Thought.deleteMany({ username : dbUserData.username },
              function(err, obj) {
                if (err) throw err;
                console.log(obj.result.n + " document(s) deleted");
                
              })
              .catch(err => res.json(err));*/
            })
          .catch(err => res.json(err));
    },
  // POST /api/users/:userId/friends/:friendId
  addFriend({ params }, res) {
    // add friendId to userId's friend list
    User.findOneAndUpdate(
        { _id: params.userId },
        { $addToSet: { friends: params.friendId } },
        { new: true, runValidators: true }
    )
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this userId' });
            return;
        }
        // add userId to friendId's friend list
        User.findOneAndUpdate(
          { _id: params.friendId },
          { $addToSet: { friends: params.userId } },
          { new: true, runValidators: true }
      )
      .then(dbUser2Data => {
          if(!dbUser2Data) {
              res.status(404).json({ message: 'No user found with this friendId' })
              return;
          }
          res.json(dbUserData);
      })
      .catch(err => res.json(err));
  })
  .catch(err => res.json(err));
},

// DELETE /api/users/:userId/friends/:friendId

deleteFriend({ params }, res) {
  // remove friendId from userId's friend list
  User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true, runValidators: true }
  )
  .then(dbUserData => {
      if (!dbUserData) {
          res.status(404).json({ message: 'No user with this userId' });
          return;
      }
       // remove userId from friendId's friend list
       User.findOneAndUpdate(
        { _id: params.friendId },
        { $pull: { friends: params.userId } },
        { new: true, runValidators: true }
    )
    .then(dbUser2Data => {
        if(!dbUser2Data) {
            res.status(404).json({ message: 'No user with this friendId' })
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => res.json(err));
})
.catch(err => res.json(err));
}

}

module.exports = userController;
