function rnd(min, max, integer) {

    if (!integer) {
        return Math.random() * (max - min) + min
    } else {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

}

function choice(array) {
    return array[rnd(0, array.length - 1, true)]
}

exports.choice = choice
exports.rnd = rnd
