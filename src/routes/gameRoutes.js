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
        const token = jwt.sign({ userId: game.players[0]._id }, 'MY_SECRET_KEY');
        res.send({ token });
    }
    catch (err) {
        return res.status(422).send(err.message);
    }
});

router.post('/join', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(422).send({ error: 'Must provide a code' })
    }

    const game = await Game.findOne({ code });
    if (!game) {
        return res.status(422).send({ error: 'Invalid code' });
    }

    try {
        const n = game.players.length;
        const name = `Joueur ${n + 1}`
        game.players.push({ name, mix: { water: 0, wind: 0, sun: 0, gas: 0, nuclear: 0 } });
        await game.save();
        res.send({ name });
    } catch (err) {
        return res.status(422).send({ error: err.message })
    }
});

router.post('/remove', async (req, res) => {
    const { code } = req.body;

    await Game.findOneAndRemove(
        { code }
    );

    res.send("Done");
})

module.exports = router;
