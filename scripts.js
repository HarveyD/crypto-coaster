class Constants {
    static get Countdown() {
        return 25;
    }

    static get ApiUrl() {
        return 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,BTC&tsyms=USD';
    }
}

class Coin {
    constructor() {
        this.price = 0;
        this.lastPrice = 0;
    }
}

class Bitcoin extends Coin {
    constructor() {
        super();
        this.imgUrl = 'btc-coaster.gif';
    }
}

class Ether extends Coin {
    constructor() {
        super();
        this.imgUrl = 'eth-coaster.gif';
    }
}

(function init() {
    let ether = new Ether();
    let bitcoin = new Bitcoin(); 

    let currentCoin = bitcoin;
    
    let coinDict = {
        'ETH': ether,
        'BTC': bitcoin
    };
    
    let pollCount = Constants.Countdown;
    
    $(document).ready(() => {
        switchCoin(bitcoin);
        poll();
    });

    let switchCoin = function(coin) {
        $("#coaster").attr("src", coin.imgUrl);
        currentCoin = coin;
        updatePrice();
    }
    
    let countDown = function() {
        pollCount -= 1;
        $('#countdown').text(pollCount);
    
        if (pollCount <= 0 ) {
            pollCount = Constants.Countdown;
            poll();
            return;
        }
    
        setTimeout(() => {
            countDown();
        }, 1000);
    }
    
    let poll = () => {
        $.ajax({url: Constants.ApiUrl, success: (result) => {
            Object.keys(result).forEach(coin => {
                let selectedCoin = coinDict[coin];
                if (selectedCoin) {
                    selectedCoin.lastPrice = selectedCoin.price
                    selectedCoin.price = Math.round(result[coin].USD * 100) / 100;
                }
            });
    
            updatePrice();
            countDown();
        }});
    }
    
    let updatePrice = function() {
        const price = currentCoin.price;
        const lastPrice = currentCoin.lastPrice;

        $('#price').text(`$${price} USD`);

        const delta = Math.round(Math.abs(price - lastPrice)*100) / 100;

        if (lastPrice === price || price === 0 || price === delta ) {
            priceStable();
        } else if (lastPrice < price) {
            priceDecrease(delta);
        } else {
            priceIncrease(delta);
        }
    }

    let priceStable = function() {
        $('#price').css('color', 'grey');
        $('#coaster').removeClass('up');
        $('#coaster').removeClass('down');
        $('#coaster').addClass('sideways');
        
        $('#delta').html(`(&#8594; $0)`);
    }
    
    let priceIncrease = function (delta) {
        $('#price').css('color', 'green');
        $('#coaster').removeClass('down');
        $('#coaster').removeClass('sideways');
        $('#coaster').addClass('up');
    
        $('#delta').html(`(&#8593; $${delta})`);
    }
    
    let priceDecrease = function(delta) {
        $('#price').css('color', 'red');
        $('#coaster').removeClass('up');
        $('#coaster').removeClass('sideways');
        $('#coaster').addClass('down');
    
        $('#delta').html(`(&#8595; $${delta})`);
    }

    $("#btc-button").click(function() {
        switchCoin(bitcoin);
      });

    $("#eth-button").click(function() {
        switchCoin(ether);
    });
}());