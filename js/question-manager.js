"use strict";

class QuestionManager {

    static init() {

        this.$$inputs = [$('#infinite'), $('#simple'), $('#participle')]
        this.$checkBtn = $('#check')

        this.bindDOM()
    }

    static bindDOM() {
        const submit = (e) => {
            if (e.keyCode != 13) {
                return
            }

            this.check()
        }
        this.$checkBtn.bind('click', () => {
            if (this.$checkBtn.data('action') == 'ask') {
                // the answer were shown
                this.$$inputs.forEach(function ($input) {
                    $input.parent().removeClass('valid').enabled(true)
                }, this)
                this.$checkBtn.text('Check!')
                this.$checkBtn.data('action', '')
                return this.ask()
            }
            this.check.call(this)
        })

        this.$$inputs.forEach(function ($input) {
            $input.bind('keydown', submit)
        }, this)
    }

    static check() {

        const errorLevel = this.getErrorLevel()

        if (errorLevel > 0) {
            this.failedTimes ++
        }

        const showAnswer = this.failedTimes > 2

        EM.emit('check question', {
            errorLevel: errorLevel,
            failedTimes: this.failedTimes,
            showAnswer: showAnswer
        })

        if (showAnswer) {
            this.showAnswer()
        } else if (errorLevel == 0) {
            this.ask()
        }

    }

    static showAnswer() {
        this.$$inputs.forEach(function ($input, index) {
            $input.enabled(false).val(this.verb[index]).parent().addClass('valid')
        }, this)
        this.$checkBtn.data('action', 'ask').html('Ok... Next question please! &rarr;')
    }

    static getErrorLevel() {

        let errorLevel = 0;

        this.$$inputs.forEach(function ($input, index) {
            if ($input.attr('disabled') != 'disabled'
                && $input.val().toLowerCase() != this.verb[index]) {
                errorLevel ++
            }
        }, this)

        return errorLevel

    }

    static pickVerb() {
        // this is where all the magic is going to happen
        const key = random.choice(Object.keys(irregurlarVerbs))
        return [key, irregurlarVerbs[key]['past'], irregurlarVerbs[key]['participles']]
    }

    static render() {
        this.$$input.forEach(function ($input) {
            $input.val('').enabled(true)
        }, this)

        this.$$inputs[this.refIndex !0 ? 0 : 1].focus()

        var val = this.verb[this.refIndex]
        if (typeof val != 'string') {
            val = val.join(' or ')
        }
        this.$$inputs[this.refIndex].val(val).enabled(false)
    }

    static ask() {
        this.failedTimes = 0
        this.verb = this.pickVerb()
        this.refIndex = random.rnd(0, 2, true)
        this.render()
    }

}

module.exports = QuestionManager
