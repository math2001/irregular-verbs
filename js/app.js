"use strict";

const $ = require('jquery')
const emojione = require('./js/emojione.min')
const irregurlarVerbs = require('english-irregular-verbs')
const random = require('./js/random')
const EM = require('./js/event-emitter')
const Score = require('./js/score')
const Message = require('./js/message')
const QuestionManager = require('./js/question-manager')

emojione.imagePathSVG = 'imgs/emojione/'
emojione.imageType = 'svg'

require('string-format').extend(String.prototype, {}) // set String::format

$.fn.enabled = function (enabled) { return this.attr('disabled', !enabled) }

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

    Message.init()
    Score.init()
    QuestionManager.init()

})()
