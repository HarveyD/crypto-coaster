class Constants {
    static get Countdown() {
        return 15;
    }

    static get ApiUrl() {
        return 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,BTC&tsyms=USD';
    }

    static get Green() {
        return 'rgb(74, 134, 119)';
    }

    static get Red() {
        return 'rgb(120, 72, 61)';
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
        this.uptrend = true;
        this.yesterdayPrice = 0;
        this.yesterdayPriceUrl = `https://min-api.cryptocompare.com/data/pricehistorical?fsym=BTC&tsyms=USD&ts=${new Date().getTime() - 86400000}`;
    }
}

class Ether extends Coin {
    constructor() {
        super();
        this.imgUrl = 'eth-coaster.gif';
        this.uptrend = true;
        this.yesterdayPrice = 0;
        this.yesterdayPriceUrl = `https://min-api.cryptocompare.com/data/pricehistorical?fsym=ETH&tsyms=USD&ts=${new Date().getTime() - 86400000}`;
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
        yesterdayPrice();
        
        switchCoin(bitcoin);
        poll();
    });

    let yesterdayPrice = function() {
        Object.keys(coinDict).forEach(c => {
            $.ajax({url: coinDict[c].yesterdayPriceUrl, success: (result) => {
                coinDict[c].yesterdayPrice = result[c].USD;
            }});
        });
    }

    let switchCoin = function(coin) {
        $("#coaster").attr("src", coin.imgUrl);
        currentCoin = coin;
        updatePrice();
    }
    
    let countDown = function() {
        pollCount -= 1;
        $('#countdown').text(pollCount);
    
        if (pollCount <= 0 ) {
            $('#last-price-container').addClass('grow');
            setTimeout(() => { $('#last-price-container').removeClass('grow'); }, 2000);
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
        updateYesterdayPrice();
        
        const price = currentCoin.price;
        const lastPrice = currentCoin.lastPrice;

        $('#price').text(`$${price} USD`);

        const delta = Math.round(Math.abs(price - lastPrice) * 100) / 100;

        if (lastPrice === price || price === 0 || price === delta ) {
            priceStable();
        } else if (lastPrice < price) {
            priceDecrease(delta);
        } else {
            priceIncrease(delta);
        }
    }

    let updateYesterdayPrice = function() {
        $('#yesterday-price').text(`$${currentCoin.yesterdayPrice} USD `);

        let yesterdayDelta = Math.round((currentCoin.price - currentCoin.yesterdayPrice) * 100) / 100;
        
        if (yesterdayDelta >= 0 ) {
            $('#yesterday-price').append(`(&#8593; $${Math.abs(yesterdayDelta)}`);
            currentCoin.uptrend = true;
        } else {
            $('#yesterday-price').append(`(&#8595; $${Math.abs(yesterdayDelta)})`);
            currentCoin.uptrend = false;
        }
        
        if (currentCoin.yesterdayPrice >= currentCoin.price) {
            $('#yesterday-price').css('color', Constants.Red);
        } else {
            $('#yesterday-price').css('color', Constants.Green);
        }
    }

    let priceStable = function() {
        colorText('grey');
        changeDirection('sideways');
        
        $('#delta').html(`(&#8594; $0)`);
    }
    
    let priceIncrease = function (delta) {
        colorText(Constants.Green);

        if (currentCoin.uptrend) {
            changeDirection('up');
        } else {
            changeDirection('up-diagonal');
        }
    
        $('#delta').html(`(&#8593; $${delta})`);
    }
    
    let priceDecrease = function(delta) {
        colorText(Constants.Red);

        if (currentCoin.uptrend) {
            changeDirection('down-diagonal');
        } else {
            changeDirection('down');
        }
    
        $('#delta').html(`(&#8595; $${delta})`);
    }

    changeDirection = function(direction) {
        $('#coaster').removeClass('up');
        $('#coaster').removeClass('up-diagonal');
        $('#coaster').removeClass('sideways');
        $('#coaster').removeClass('down');
        $('#coaster').removeClass('down-diagonal');
 
        $('#coaster').addClass(direction);
    }

    let colorText = function(rgb) {
        $('#price').css('color', rgb);
        $('#delta').css('color', rgb);
    }

    $("#btc-button").click(function() {
        switchCoin(bitcoin);
        $('#eth-button').removeClass('selected-eth');
        $('#btc-button').addClass('selected-btc');
    });

    $("#eth-button").click(function() {
        switchCoin(ether);
        $('#eth-button').addClass('selected-eth');
        $('#btc-button').removeClass('selected-btc');
    });
}());