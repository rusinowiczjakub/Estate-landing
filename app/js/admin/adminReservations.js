var actionLink = $('#reservations');
var contentPlace = $('#contentPlace');
var monthDict = [
    'styczeń',
    'luty',
    'marzec',
    'kwiecień',
    'maj',
    'czerwiec',
    'lipiec',
    'sierpień',
    'wrzesień',
    'październik',
    'listopad',
    'grudzień',
]

var monthsArray = [];

var singleMonthTerms;


$(document).ready(function() {
    actionLink.click(function() {
        contentPlace.empty();
        changeContent(function() {
            $.ajax({
                url: 'src/reservedTerms.php',
                type: 'GET',
                dataType: 'json',
            })
            .done(function(resp) {
                // console.log(resp);
                if (resp.status == 0) {
                    contentPlace.html('<h1>Brak rezerwacji</h1>');
                } else {
                    $.ajax({
                        url: 'html/reservations.html',
                        type: 'GET',
                        dataType: 'html'
                    })
                    .done(function (html) {
                        initEmptyMonthsArrays();
                        $(contentPlace).append(html);

                        $.each(resp.data, function(index, el) {
                            var termMonth = new Date(el.date);
                            monthsArray[termMonth.getMonth()].push(el);
                            // console.log(monthsArray);
                            getElementsByMonth(monthsArray);
                        });
                    });
                }
            });
        });
    });
})


function getElementsByMonth(monthsArray) {
    for (var i = 0; i < monthDict.length; i++) {
        if (monthsArray[i].length < 1) {
            $('#'+monthDict[i]).append(
            '<br><h4>Brak rezerwacji</h4><br>'
            );
        } else {
            if (monthsArray[i].length == 1) {
                $('#'+monthDict[i]).append(
                '<br><h4>'+monthsArray[i].length+'</h4>'+
                '<h4>rezerwacja</h4>'+
                '<button class="btn btn-outline" onclick=getTermsForMonth(this) data-month='+(i+1)+'>Wyświetl</button>'
                );
                console.log(monthsArray);
            } else {
                $('#'+monthDict[i]).append(
                '<br><h4>'+monthsArray[i].length+'</h4>'+
                '<h4>rezerwacji</h4>'+
                '<button class="btn btn-outline" onclick=getTermsForMonth(this) data-month='+(i+1)+'>Wyświetl</button>'
                );
            }
        }
    }
}

function initEmptyMonthsArrays()
{
    for (var i = 0; i <= 11; i++) {
        monthsArray[i] = [];
    }

    return monthsArray;
}

function getTermsForMonth(elem) {
    $.ajax({
        url: 'src/reservedTerms.php',
        type: 'GET',
        dataType: 'json',
        data: {month: elem.dataset.month}
    })
    .done(function(resp) {
        singleMonthTerms = resp;
        displayPopup();
    })
}

function displayPopup() {
    $.ajax({
        url: 'html/reservations-popup.html',
        type: 'GET',
        dataType: 'html'
    })
    .done(function(html) {
        $(html).prependTo('body');
        fillInPopup();
        $('.popup').animate({opacity: '1', left: '0'}, 600);
    });
}

function closePopup() {
    $('.popup').animate({opacity: '0', left: '-100%'}, 600, function() {
        $(this).remove();
    });
}

function fillInPopup() {
    $.each(singleMonthTerms.data, function(index, el) {
        $('table').append(
            "<tr>"+
            "<td>"+index+"</td>"+
            "<td>"+el.date+"</td>"+
            "<td>"+el.person.name+"</td>"+
            "<td>"+el.person.email+"</td>"+
            "<td>"+el.person.phone+"</td>"+
            "</tr>"
        );
    });
}
