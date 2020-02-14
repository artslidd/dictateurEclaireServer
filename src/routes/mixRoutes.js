const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Game = mongoose.model('Game');


router.get('/allMixes', async (req, res) => {
    try {
        const { code } = req.headers;
        // Finding the mix 
        game = await Game.findOne({
            code
        })
        res.send({ game });
    } catch (err) {
        res.status(422).send({ err: "Erreur !" })
    }
});

router.get('/players', async (req, res) => {
    try {
        const { code } = req.headers;
        // Finding the mix 
        game = await Game.findOne({
            code
        })
        res.send({ players: game.players });
    } catch (err) {
        res.status(422).send({ err: "Erreur !" })
    }
});

router.get('/arePlayersDone', async (req, res) => {
    try {
        const { code } = req.headers;
        game = await Game.findOne({
            code
        })
        if (game.players.some(nonLegit) || !game.launched) {
            res.send({ allPlayersDone: false });
        }
        else {
            res.send({ allPlayersDone: true });
        }
    } catch (err) {
        res.status(422).send({ err: "Erreur !" })
    }
});

router.post('/sendMix', async (req, res) => {
    const { code, name } = req.headers;
    const { mix: { water, wind, sun, gas, nuclear } } = req.body;

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
        players[ind].mix = { water, wind, sun, gas, nuclear };
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
                return res.send({ err: "Erreur pendant l'envoi du mix" })
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
