"use strict";

const $ = require('jquery')
const irregurlarVerbs = require('english-irregular-verbs')
const random = require('./js/random')
const EM = require('./js/event-emitter')
const Score = require('./js/score')
const Message = require('./js/message')

require('string-format').extend(String.prototype, {}) // set String::format

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
            Score.bump()
            Message.say("Well done! That's a valid answer!", 'success')
            this.ask()
        } else {
            Message.say("Oops... There {} {} error{}".format(errorLevel > 1 ? 'are' : 'is',
                                                             errorLevel,
                                                             errorLevel > 1 ? 's' : ''),
                        'error')
            Score.drop(errorLevel)
        }
    }

    static getErrorLevel() {
        let errorLevel = 0, value;

        value = this.$infinite.val()
        if (value != undefined && value.toLowerCase() != this.verb[0]) errorLevel++

        value = this.$simple.val()
        if (value != undefined && value.toLowerCase() != this.verb[1]) errorLevel++

        value = this.$participle.val()
        if (value != undefined && !this.verb[2].includes(value.toLowerCase())) errorLevel++

        return errorLevel
    }

    static pickVerb() {
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
        this.verb = this.pickVerb()
        this.refIndex = random.rnd(0, 2, true)
        this.render()
    }

}


(function () {

    function browsePages() {
        function browse(pageId) {
            const $currentPage = $('.page.current').removeClass('current').addClass('past')
            let $page = $('.page#' + pageId)
            $page.addClass('current')
        }
        EM.on('browse', browse)
        $('[data-goto]').bind('click', function () {
            EM.emit('browse', $(this).data('goto'))
        })
    }

    

    browsePages()

    EM.on('browse', pageId => {
        if (pageId == 'play') {
            setTimeout(function() {
                QuestionManager.ask()
            }, 500);
        }
    })

    QuestionManager.init()
    Score.init()
    Message.init()

})()
