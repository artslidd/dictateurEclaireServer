const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Game = mongoose.model('Game');

module.exports = (req, res, next) => {
    const { code, authorization } = req.headers;
    // authorization === 'Bearer wgkjerogbgo'

    if (!authorization) {
        return res.status(401).send({ error: 'You must be logged in.' })
    }

    const name = authorization.replace('Bearer ', '');
    jwt.verify(token, 'MY_SECRET_KEY', async (err, payload) => {
        if (err) {
            return res.status(401).send({ error: 'You must be logged in.' })
        }

        const { playerId } = payload;
        const player = await Game.find({ 'players.id': playerId });
        req.user = player;
        next();
    });
};