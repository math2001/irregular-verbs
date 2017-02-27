"use strict";

class QuestionManager {

    static init() {
        this.$infinite = $("#infinite")
        this.$simple = $("#simple")
        this.$participle = $("#participle")
        this.$check = $('#check')

        this.bindDOM()
    }

    static bindDOM() {
        const submit = (e) => {
            if (e.keyCode != 13) {
                return
            }

            this.check()
        }
        this.$check.bind('click', this.check.bind(this))
        this.$infinite.bind('keydown', submit)
        this.$simple.bind('keydown', submit)
        this.$participle.bind('keydown', submit)
    }

    static check() {

        const errorLevel = this.getErrorLevel()

        if (errorLevel == 0) {
            if (this.failed_times == 0) {
                Score.bump(3)
                Message.say("Well done! That's a valid answer!", 'success')
            } else if (this.failed_times >= 1) {
                Message.say("Hum... That's not perfect, is it? 🙄 Get it right straight away next time, OK! 😠", 'success')
                Score.bump(1)
            }
            else if (this.failed_times >= 2) {
                Message.say("Finally! Hope you'll spit it out faster next time! 😠😉<br>Ain't giving you any score.", 'success')
            }
            this.ask()
        } else {
            if (this.failed_times >= 2) {
            }
            const show_answer = () => {
                Message.say("Oh, that's not good. You have to stop <b>guessing</b>! 😡 Here's the answer.", 'info')
                this.show_answer()
            }

            if (errorLevel == 1) {
                if (this.failed_times >= 3) {
                    return show_answer()
                }
                Message.say("You missed one... 😕", 'error')
            } else if (errorLevel == 2) {
                if (this.failed_times >= 2) {
                    return show_answer()
                }
                Message.say("Pff... You're hopeless. 🙄 <b><big>2</big></b> mistakes{}! 😡"
                            .format(this.failed_times >= 1 ? ' <b><big>again</big><b>' : ''), 'error')
            }
            Score.drop(errorLevel)
            this.failed_times += 1
        }
        Score.render()

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

    static resetInputs() {
        this.$infinite.val('').removeAttr('disabled')
        this.$simple.val('').removeAttr('disabled')
        this.$participle.val('').removeAttr('disabled')
    }

    static render() {
        this.resetInputs()
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
        this.failed_times = 0
        this.verb = this.pickVerb()
        this.refIndex = random.rnd(0, 2, true)
        this.render()
    }

}

module.exports = QuestionManager
