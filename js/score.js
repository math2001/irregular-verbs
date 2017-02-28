"use strict";

class Score {

    static init() {
        this.score = 0
        this.cacheDOM()
        this.bindEvents()
        this.render()
    }

    static cacheDOM() {
        this.$score = $("#score")
    }

    static bump(helium_quantity=1) {
        this.score += helium_quantity
    }

    static drop(weight=1) {
        this.score -= weight
    }

    static render() {
        // this is needed to re-run the animation
        this.$score.replaceWith((this.$score = this.$score.clone().text(this.score)))
    }

    static onQuestionCheck(data) {
        const {errorLevel, failedTimes} = data
        if (errorLevel == 0) {
            if (failedTimes == 0) {
                this.bump(3)
            } else if (failedTimes == 1) {
                this.bump(1)
            }
        } else {
            this.drop(errorLevel)
        }
        this.render()

    }

    static bindEvents() {
        EM.on('check question', this.onQuestionCheck.bind(this))
    }
}

module.exports = Score
