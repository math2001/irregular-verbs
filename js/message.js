"use strict";

class Message {

    // A simple class to display simple alert message

    static init() {
        this.cacheDOM();
        this.listenDOM()
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

    static say(message, type, time=5000) {
        if (typeof this._lastTimeout != 'undefined') {
            clearTimeout(this._lastTimeout)
        }

        if (message != null) {
            this.$para.text(message)
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

}

module.exports = Message
