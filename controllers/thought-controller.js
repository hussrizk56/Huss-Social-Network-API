const { User,Thought} = require('../models');

//Thought controller
const thoughtController = {

    // get all thoughts
    getAllThought(req, res) {
      Thought.find({})
        .sort({ _id: -1 })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },

    // get one thought by id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .then(dbThoughtData => {
            // If no thought found, send 404
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No thought found with this id!' });
              return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

     // createThought
     createThought({body }, res) {
      console.log(body);
      Thought.create(body)
        .then(({ _id }) => {
          return User.findOneAndUpdate(
            { _id: body.userId },
            { $push: { thoughts: _id } },
            { new: true }
          );
        })
        .then(dbThoughtData => {
          if (!dbThoughtData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
          }
          res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },

    // update thought by id
     updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true ,runValidators: true })
          .then(dbThoughtData => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No thought found with this id!' });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => res.status(400).json(err));
    },
     // delete thought by id
     deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
          .then(dbThoughtData => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No thought found with this id!' });
              return;
            }
            // delete thought reference from user
            User.findOneAndUpdate(
              { username: dbThoughtData.username },
              { $pull: { thoughts: params.id } }
          )
          .then(() => {
              res.json({message: 'Thought deleted'});
          })
          .catch(err => res.status(500).json(err));
      })
      .catch(err => res.status(500).json(err));
    },

     //add reaction to thought
  addReaction({ params, body }, res) {
    
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true ,runValidators: true}
    )
      .then(dbData => {
        if (!dbData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbData);
      })
      .catch(err => res.json(err));
  },

    // remove reaction from thought
    removeReaction({ params }, res) {
      
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions : { reactionId: params.reactionId } } },
      { new: true }
    )
    .then(dbData => {
      if (!dbData) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      res.json(dbData);
    })
    .catch(err => res.json(err));
  }
}

module.exports = thoughtController;
