"use strict";

class Score {

    static init() {
        this.score = 0
        this.cacheDOM()
        this.render()
    }

    static cacheDOM() {
        this.$score = $("#score")
    }

    static bump() {
        this.score ++
    }

    static drop(weight) {
        this.score -= weight
    }

    static render() {
        // this is needed to re-run the animation
        this.$score.replaceWith((this.$score = this.$score.clone().text(this.score)))
    }
}

module.exports = Score
