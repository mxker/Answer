"use strict";

var AnswerItem = function(text) {
    if (text) {
        var obj = JSON.parse(text);
        this.issue = obj.issue;
        this.answer = obj.answer;
        this.author = obj.author;
    }else {
        this.issue = "";
        this.answer = "";
        this.author = "";
    }
};

AnswerItem.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

var Answer = function () {
    LocalContractStorage.defineMapProperty(this, "data", {
        parse: function (text) {
            return new AnswerItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

Answer.prototype = {
    init: function () {

    },

    save:function (issue, answer) {
        if (!issue || !answer){
            throw new Error("Issue/Answer' can not be empty.");
        }

        if (issue.length > 200 || answer.length > 200){
            throw new Error("Issue/Answer is too long.");
        }

        var from = Blockchain.transaction.from;
        var answerItem = this.data.get(issue);
        if (answerItem){
            throw new Error("Answer has been occupied");
        }

        answerItem = new AnswerItem();
        answerItem.author = from;
        answerItem.issue = issue;
        answerItem.answer = answer;

        this.data.put(issue, answerItem);
    },

    get:function (issue) {
        if(!issue){
            throw new Error("Issue can not be empty.");
        }
        return this.data.get(issue);
    }
};
module.exports = Answer;