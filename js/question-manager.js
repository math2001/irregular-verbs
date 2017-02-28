"use strict";

class QuestionManager {

    static init() {

        this.$infinite = $("#infinite")
        this.$simple = $("#simple")
        this.$participle = $("#participle")
        this.$$inputs = [this.$infinite, this.$simple, this.$participle]
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
                })
                this.$checkBtn.text('Check!')
                this.$checkBtn.data('action', '')
                return this.ask()
            }
            this.check.call(this)
        })
        this.$infinite.bind('keydown', submit)
        this.$simple.bind('keydown', submit)
        this.$participle.bind('keydown', submit)
    }

    static check() {

        const errorLevel = this.getErrorLevel()
        const showAnswer = (errorLevel  == 1 && this.failedTimes == 3)
                          || (errorLevel == 2 && this.failedTimes == 2)

        if (errorLevel > 0) {
            this.failedTimes ++
        }

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

        return

        if (errorLevel == 0) {
            if (this.failedTimes == 0) {
                Score.bump(3)
                Message.say("Well done! That's a valid answer!", 'success')
            } else if (this.failedTimes >= 1) {
                Message.say("Hum... That's not perfect, is it? 🙄 Get it right straight away next time, OK! 😠", 'success')
                Score.bump(1)
            }
            else if (this.failedTimes >= 2) {
                Message.say("Finally! Hope you'll spit it out faster next time! 😠😉<br>Ain't giving you any score.", 'success')
            }
            this.ask()
        } else {
            if (this.failedTimes >= 2) {
            }
            const showAnswer = () => {
                Message.say("Oh, that's not good. You have to stop <b>guessing</b>! 😡 Here's the answer.", 'info')
                this.showAnswer()
            }

            if (errorLevel == 1) {
                if (this.failedTimes >= 3) {
                    return showAnswer()
                }
                Message.say("You missed one... 😕", 'error')
            } else if (errorLevel == 2) {
                if (this.failedTimes >= 2) {
                    return showAnswer()
                }
                Message.say("Pff... You're hopeless. 🙄 <b><big>2</big></b> mistakes{}! 😡"
                            .format(this.failedTimes >= 1 ? ' <b><big>again</big><b>' : ''), 'error')
            }
            Score.drop(errorLevel)
            this.failedTimes += 1
        }
        Score.render()
    }

    static showAnswer() {
        this.$infinite.enabled(false).val(this.verb[0]).parent().addClass('valid')
        this.$simple.enabled(false).val(this.verb[1]).parent().addClass('valid')
        this.$participle.enabled(false).val(this.verb[2]).parent().addClass('valid')
        this.$checkBtn.data('action', 'ask').html('Ok... Next question please! &rarr;')
    }

    static getErrorLevel() {
        let errorLevel = 0, value;

        if (this.$infinite.attr('disabled') != 'disabled'
            && this.$infinite.val().toLowerCase() != this.verb[0]) errorLevel++

        if (this.$simple.attr('disabled') != 'disabled'
            && this.$simple.val().toLowerCase() != this.verb[1]) errorLevel++

        if (this.$participle.attr('disabled') != 'disabled'
            && !this.verb[2].includes(this.$participle.val().toLowerCase())) errorLevel++

        return errorLevel
    }

    static pickVerb() {
        // this is where all the magic is going to happend
        const key = random.choice(Object.keys(irregurlarVerbs))
        return [key, irregurlarVerbs[key]['past'], irregurlarVerbs[key]['participles']]
    }

    static render() {
        this.$infinite.val('').enabled(true)
        this.$simple.val('').enabled(true)
        this.$participle.val('').enabled(true)

        var $el
        if (this.refIndex == 0) {
            $el = this.$infinite
        } else if (this.refIndex == 1) {
            $el = this.$simple
        } else if (this.refIndex == 2) {
            $el = this.$participle
        }

        if (this.refIndex != 0) {
            this.$infinite.focus()
        } else {
            this.$simple.focus()
        }

        var val = this.verb[this.refIndex]
        if (typeof val != 'string') {
            val = val.join(' or ')
        }
        $el.val(val).attr('disabled', 'true')
    }

    static ask() {
        this.failedTimes = 0
        this.verb = this.pickVerb()
        this.refIndex = random.rnd(0, 2, true)
        this.render()
    }

}

module.exports = QuestionManager
