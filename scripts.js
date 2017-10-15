class Constants {
    static get Countdown() {
        return 60;
    }

    static get ApiUrl() {
        return 'https://api.coindesk.com/v1/bpi/currentprice.json';
    }
}

let lastPrice = 0;
let countDown = Constants.Countdown;

$(document).ready(() => {
    poll();
});

let countdown = function() {
    countDown -= 1;
    $('#countdown').text(countDown);

    if (countDown <= -1 ) {
        countDown = Constants.Countdown;
        poll();
        return;
    }

    setTimeout(() => {
        countdown();
    }, 1000);
}

let poll = () => {
    $.ajax({url: 'https://api.coindesk.com/v1/bpi/currentprice.json', success: (result) => {
        const res = JSON.parse(result);
        const priceString = res.bpi.USD.rate.replace(',', '');
        const price = parseInt(priceString, 10);

        updatePrice(price);
        countdown();
    }});
}

let updatePrice = function(price) {
    $('#price').text(`$${price} USD`);
    $('#price').addClass('grow');
    const delta = Math.abs(price - lastPrice);

    if(lastPrice === price ) {
    } else if (lastPrice < price) {
        priceDecrease(delta);
    } else {
        priceIncrease(delta);
    }

    lastPrice = price;
}

let priceIncrease = function (delta) {
    $('#price').css('color', 'green');
    $('#coaster').removeClass('down');
    $('#coaster').addClass('up');

    $('#delta').html(`(&#8593; $${delta})`);
}

let priceDecrease = function(delta) {
    $('#price').css('color', 'red');
    $('#coaster').removeClass('up');
    $('#coaster').addClass('down');

    $('#delta').html(`(&#8595; $${delta})`);
}
