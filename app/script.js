var questions = {}
var used = [];
var answer;
var score = 0;
var amount, total = 0;

function getQuestion() {
    var id;
    var valid = false;

    while (valid === false) {
        id = Math.floor(Math.random() * questions.length);
        if (used.indexOf(id) === -1) valid = true;
    }

    used.push(id);
    return questions[id];

}

function randomizeAnswers(q) {

    var id;
    var answers = [];
    var used = [];
    var valid = false;

    q.answers[0] += 'xx'

    while (used.length < 4) {
        id = Math.floor(Math.random() * 4);
        if (used.indexOf(id) === -1) {
            used.push(id);
            answers.push(q.answers[id]);
        }
    }

    answer = q.answers[0];

    return answers;

}

function loadQuestion() {
    var q = getQuestion();
    var answers = randomizeAnswers(q);



    $('.question-text').html(q.question);
    $('#answer1').attr('class', 'answer-button btn btn-lg btn-default').html(answers[0]);
    $('#answer2').attr('class', 'answer-button btn btn-lg btn-default').html(answers[1]);
    $('#answer3').attr('class', 'answer-button btn btn-lg btn-default').html(answers[2]);
    $('#answer4').attr('class', 'answer-button btn btn-lg btn-default').html(answers[3]);
    $('#result').text('');

}

function checkAnswers(a) {

    var temp;

    if (a.html() === answer) {
        score += 1;
        $('#result').text('Correct!');
    }
    else {
        $('#result').text('Wrong answer.');
    }
    console.log(score);

    for (i = 1; i <= 4; i++) {
        temp = $('#answer' + i);
        if (temp.html() === answer) {
            temp.addClass('btn btn-success');
        } else {
            temp.addClass('btn btn-danger');
        }
    }

    $('#next-question').css("display", "block").removeAttr("disabled");
}

$(function() {
    $.getJSON("questions.json", function(data) {
        questions = data;
    });

    $('.button').on('click', function() {
        $('body').html($('#amount-format').text());
    });

    $(document).on('click', '.amount-button', function() {
        amount = $(this).html();
        total = amount;
        $('body').html($('#questions-format').text());
        loadQuestion();
    });

    $(document).on('click', '.answer-button', function() {
        checkAnswers($(this));
    });

    $(document).on('click', '#next-question', function() {
        $('#next-question').css("display", "none").attr("disabled", "true");
        amount--;
        if(amount != 0)
            loadQuestion();
        else {
           $('body').html($('#score-format').text());
           $('#score').text('You got ' + score + ' out of ' + total);
        }
    });

    $(document).on('click', '.done-button', function() {
        location.reload();
    });








});