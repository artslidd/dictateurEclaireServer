const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Game = mongoose.model('Game');


router.get('/getMixes', async (req, res) => {
    const { code } = req.headers;
    // Finding the mix 
    game = await Game.findOne({
        code
    });
    if (game.players.some(nonLegit)) {
        res.send({ message: "Wait for other players", game });
    }
    res.send({ message: "Ready", game });
});

router.post('/sendMix', async (req, res) => {
    const { code, name } = req.headers;
    const { water, wind, sun, gas, nuclear } = req.body;

    if (typeof (water) == undefined || typeof (wind) == undefined || typeof (sun) == undefined || typeof (gas) == undefined || typeof (nuclear) == undefined) {
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
            if (err) {
                res.send({ err: "Erreur pendant l'envoi du mix" })
            }
        }
    );
    return res.send("ok");
});


const nonLegit = ({ mix }) => {
    const { water, wind, sun, gas, nuclear } = mix;
    if (!water && !wind && !sun && !gas && !nuclear) {
        return true
    }
    return false
}


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
