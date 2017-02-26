"use strict";

const $ = require('jquery')
const irregurlarVerbs = require('english-irregular-verbs')
const random = require('./js/random')
const EM = require('./js/event-emitter')
const Score = require('./js/score')
const Message = require('./js/message')
const QuestionManager = require('./js/question-manager')

require('string-format').extend(String.prototype, {}) // set String::format

;(function () {

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
    QuestionManager.ask()

})()
