"use strict";

class Score {

    static init() {
        this.score = 0
    }

    static bump() {
        this.score ++
    }

    static drop(weight) {
        this.score -= weight
    }

    static render() {
        // CSW: ignore
        console.log('score is', this.score);
    }
}

module.exports = Score
