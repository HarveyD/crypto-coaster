class Constants {
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
        this.yesterdayPrice = 0;
        this.uptrend = true;
        this.lastUpdated = 0;
        this.rotateValue = 90;
    }
}

class Bitcoin extends Coin {
    constructor() {
        super();
        this.buttonId = 'btc-button';
        this.selectedClass = 'selected-btc';
        this.imgUrl = 'assets/btc-coaster.gif';
    }

    selectCoin() {
        $(`#${this.buttonId}`).addClass(`${this.selectedClass}`);
    }
}

class Ether extends Coin {
    constructor() {
        super();
        this.buttonId = 'eth-button';
        this.selectedClass = 'selected-eth';
        this.imgUrl = 'assets/eth-coaster.gif';
    }

    selectCoin() {
        $(`#${this.buttonId}`).addClass(`${this.selectedClass}`);
    }
}

class Litecoin extends Coin {
    constructor() {
        super();
        this.buttonId = 'ltc-button';
        this.selectedClass = 'selected-ltc';
        this.imgUrl = 'assets/ltc-coaster.gif';
    }

    selectCoin() {
        $(`#${this.buttonId}`).addClass(this.selectedClass);
    }
}

(function init() {
    let ether = new Ether();
    let bitcoin = new Bitcoin(); 
    let litecoin = new Litecoin();

    let currentCoin = bitcoin;
    
    let coinDict = {
        'ETH': ether,
        'BTC': bitcoin,
        'LTC': litecoin
    };
    
    $(document).ready(() => {
        timerTick();
        initSocket();

        Object.keys(coinDict).forEach(coin => {
            initCoin(coinDict[coin]);
        });
        
        switchCoin(bitcoin);
    });

    let timerTick = function() {
        setInterval(() => {
            Object.keys(coinDict).forEach(c => {
                coinDict[c].lastUpdated += 1;
            });

            $('#countdown').text(currentCoin.lastUpdated);
        }, 1000);
    }

    let initSocket = function() {
        var socket = io.connect('https://streamer.cryptocompare.com/');
        
        //Format: {SubscriptionId}~{ExchangeName}~{FromSymbol}~{ToSymbol}
        //Use SubscriptionId 0 for TRADE, 2 for CURRENT and 5 for CURRENTAGG
        //For aggregate quote updates use CCCAGG as market
        var subscription = ['5~CCCAGG~BTC~USD','5~CCCAGG~ETH~USD', '5~CCCAGG~LTC~USD'];
        
        socket.emit('SubAdd', {subs:subscription} );
        
        socket.on("m", function(message){
            var messageType = message.substring(0, message.indexOf("~"));
            var res = {};
            if (messageType === CCC.STATIC.TYPE.CURRENTAGG) {
                res = CCC.CURRENT.unpack(message);
                processUpdate(res);
            }						
        });
    } 

    let initCoin = function(coin) {
        $(`#${coin.buttonId}`).click(function() {
            switchCoin(coin);
        });
    }

    let processUpdate = function(update) {
        let processCoin = coinDict[update.FROMSYMBOL];
        if (processCoin) {
            if (update.PRICE) {
                processCoin.lastPrice = processCoin.price
                processCoin.price = update.PRICE;
                processCoin.lastUpdated = -1;

                $('#price').addClass('grow');
                setTimeout(() => { $('#price').removeClass('grow'); }, 1000);
            }

            if (update.OPENHOUR){
                // if (processCoin.yesterdayPrice === 0 ) {
                //     initRotate(update.OPENHOUR);
                // }

                processCoin.yesterdayPrice = update.OPENHOUR;
            }

            if (currentCoin === processCoin){
                updatePrice();
            }
        }
    }

    let switchCoin = function(coin) {
        Object.keys(coinDict).forEach(c => {
            let coin = coinDict[c];
            $(`#${coin.buttonId}`).removeClass(coin.selectedClass);
        });

        coin.selectCoin();

        $("#coaster").attr("src", coin.imgUrl);
        $("#countdown").text(coin.lastUpdated);

        currentCoin = coin;
        updatePrice();
    }
    
    let updatePrice = function() {
        updateYesterdayPrice();
        
        const price = currentCoin.price;
        const lastPrice = currentCoin.lastPrice;

        $('#price').text(`$${price} USD`);

        const delta = Math.round(Math.abs(price - lastPrice) * 100) / 100;

        if (lastPrice === price || price === 0 || price === delta ) {
            priceStable();
        } else if (price > lastPrice) {
            priceIncrease(delta);
        } else {
            priceDecrease(delta);
        }
    }

    let updateYesterdayPrice = function() {
        $('#yesterday-price').text(`$${currentCoin.yesterdayPrice} USD `);

        const yesterdayDelta = Math.round((currentCoin.price - currentCoin.yesterdayPrice) * 100) / 100;
        if (currentCoin.price >= currentCoin.yesterdayPrice) {
            $('#yesterday-price').css('color', Constants.Green);
            $('#yesterday-price').append(`(&#8593; $${Math.abs(yesterdayDelta)})`);
            currentCoin.uptrend = true;
        } else {
            $('#yesterday-price').css('color', Constants.Red);
            $('#yesterday-price').append(`(&#8595; $${Math.abs(yesterdayDelta)})`);
            currentCoin.uptrend = false;
        }
    }

    let priceStable = function() {
        colorText('grey');
        
        $('#delta').html(`(&#8594; $0)`);
    }
    
    let priceIncrease = function (delta) {
        colorText(Constants.Green);

        const change = (delta / currentCoin.price) * 15000;

        if (currentCoin.rotateValue - change > 0) {
            currentCoin.rotateValue -= change;
        } else {
            currentCoin.rotateValue = 0;
        }

        changeDirection(currentCoin.rotateValue);

        $('#delta').html(`(&#8593; $${delta})`);
    }
    
    let priceDecrease = function(delta) {
        colorText(Constants.Red);

        const change = (delta / currentCoin.price) * 15000;
        
        if (currentCoin.rotateValue + change < 180) {
            currentCoin.rotateValue += change;
        } else {
            currentCoin.rotateValue = 180;
        }

        changeDirection(currentCoin.rotateValue);

        $('#delta').html(`(&#8595; $${delta})`);
    }

    changeDirection = function(direction) {
        $('#coaster').css({'transform': 'rotate(' + direction + 'deg)'});
        $('#coaster').css({'-ms-transform': 'rotate(' + direction + 'deg)'});
        $('#coaster').css({'-webkit-transform': 'rotate(' + direction + 'deg)'});
    }

    let colorText = function(rgb) {
        $('#price').css('color', rgb);
        $('#delta').css('color', rgb);
    }
}());
