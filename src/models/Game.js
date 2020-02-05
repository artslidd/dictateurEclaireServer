const mongoose = require("mongoose");

const mixSchema = new mongoose.Schema({
    water: {
        type: Number,
    },
    wind: {
        type: Number,
    },
    sun: {
        type: Number,
    },
    nuclear: {
        type: Number,
    },
    gas: {
        type: Number,
    }
});

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'Vous'
    },
    mix: {
        type: mixSchema,
    }
});

const gameSchema = new mongoose.Schema({
    code: {
        type: Number,
        unique: true,
        required: true
    },
    launched: {
        type: Boolean,
        default: false
    },
    players: {
        type: Array,
        items: playerSchema,
        validate: [arrayLimit, "Impossible de joindre cette partie: déjà 8 joueurs !"],
        default: [{ name: 'Vous', mix: { water: 0, wind: 0, sun: 0, gas: 0, nuclear: 0 } }],
    }
});

function arrayLimit(val) {
    return val.length <= 8;
}

mongoose.model('Game', gameSchema);