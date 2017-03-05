"use strict";

class Message {

    // A simple class to display simple alert message

    static init() {
        this.cacheDOM()
        this.listenDOM()

        this.bindEvents()
    }

    static cacheDOM($message) {
        this.$message = $message || $('#message')
        this.$para = this.$message.find('p').first()
    }

    static listenDOM() {
        let _this = this
        $('body').on('click', '.close', function () {
            $(this).parent().addClass('hidden')
        })
    }

    static say(message, type, time=4000) {
        message = emojione.toImage(message)
        if (typeof this._lastTimeout != 'undefined') {
            clearTimeout(this._lastTimeout)
        }

        if (message != null) {
            this.$para.html(message)
        }
        let $clone = this.$message.clone()
        this.$message.before($clone).remove()
        this.$message = $clone
        this.cacheDOM(this.$message)
        this.$message.removeClass('hidden')
        this.$message.attr('data-type', type)
        if (type != 'none') {
            this._lastTimeout = setTimeout(() => this.$message.addClass('hidden'), time)
        }
    }

    static success(message) { this.say(message, 'success') }
    static info(message) { this.say(message, 'info') }
    static error(message) { this.say(message, 'error') }

    static onQuestionCheck(data) {

        const {errorLevel, failedTimes, showAnswer} = data

        if (showAnswer) {
            return this.info("Oh, that's not good. You have to stop <b>guessing</b>! 😡 Here's the answer.")
        }

        if (errorLevel == 0) {
            if (failedTimes == 0) {
                this.success("Well done! That's a valid answer!")
            } else if (failedTimes == 1) {
                this.success("Hum... That's not perfect, is it? 🙄 Get it right straight away next time, OK! 😠")
            } else if (failedTimes >= 2) {
                this.say("Finally! Hope you'll spit it out faster next time! 😠😉<br>Ain't giving you any score.")
            }
        }  else {
            const again = failedTimes >= 2 ? '<big><b>again</b><big>' : ''
            if (errorLevel == 1) {
                this.error("You missed one... {again}😕".format({again: again + ' '}))
            } else if (errorLevel == 2) {
                this.error("Pff... You're hopeless. 🙄 <b><big>2</big></b> mistakes{}! 😡"
                            .format(' ' + again))
            }
        }

    }

    static bindEvents() {

        EM.on('check question', this.onQuestionCheck.bind(this))

    }

}

module.exports = Message
