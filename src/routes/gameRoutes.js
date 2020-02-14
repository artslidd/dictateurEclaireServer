const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Game = mongoose.model('Game');

router.post('/create', async (req, res) => {
    const { code } = req.body;
    try {
        const game = new Game({
            code
        });
        await game.save();
        res.send({ code, name: 'Vous', launched: game.launched, players: game.players })
    }
    catch (err) {
        return res.status(422).send(err.message);
    }
});

router.post('/join', async (req, res) => {
    const { code } = req.body;
    try {
        if (!code) {
            return res.status(422).send({ error: 'Must provide a code' })
        }

        const game = await Game.findOne({ code });
        if (!game) {
            return res.status(422).send({ error: 'Invalid code' });
        }

        if (game.launched) {
            return res.status(422).send({ error: "You cannot join anymore" })
        }

        const n = game.players.length;
        const name = `Joueur ${n + 1}`
        game.players.push({ name, mix: { water: 0, wind: 0, sun: 0, gas: 0, nuclear: 0 } });
        await game.save();
        res.send({ code, name, launched: game.launched, players: game.players });
    } catch (err) {
        return res.status(422).send({ error: err.message })
    }
});

router.post('/launch', async (req, res) => {
    const { code } = req.body;

    await Game.findOneAndUpdate(
        { code },
        {
            $set: {
                'launched': true
            }
        },
        (err, doc) => {
            if (err) {
                res.send({ err: "Erreur pendant l'envoi du mix" })
            }
        }
    );

    res.send({ launched: true });
});

router.post('/remove', async (req, res) => {
    const { code } = req.body;

    await Game.findOneAndRemove(
        { code },
        (err, res) => {
            if (err) {
                res.send({ err: "Erreur pendant la suppression del la partie" })
            }
        }
    );

    res.send("Done");
});

module.exports = router;
