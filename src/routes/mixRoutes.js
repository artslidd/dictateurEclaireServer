const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Game = mongoose.model('Game');
const requireAuth = require('../middlewares/requireAuth');

// router.use(requireAuth);

router.post('/sendMix', async (req, res) => {
    const { code, name } = req.headers;
    const { water, wind, sun, gas, nuclear } = req.body;

    if (!water || !wind || !sun || !gas || !nuclear) {
        return res
            .status(422)
            .send({ error: "Send the whole mix please" })
    }

    const ind = nameToId(name);
    let players = null;
    // Finding the mix we have to change and create the array
    await Game.findOne({
        code
    }).then(game => {
        players = game.players;
        players[ind].mix = req.body;
    });

    await Game.findOneAndUpdate(
        { code },
        {
            $set: {
                'players': players
            }
        },
        (err, doc) => {
            res.send({ err: "Error when modifying mix" })
        }
    );
    return res.send("ok");
});

const nameToId = (name) => {
    switch (name) {
        case 'Vous':
            return 0;
        default:
            try {
                let s = name.replace('Joueur ', '');
                return parseInt(s) - 1;
            } catch (err) {
                return err.message;
            }
    }
}

module.exports = router;
