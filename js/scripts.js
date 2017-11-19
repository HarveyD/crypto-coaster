class Constants {
	static get Green() {
		return 'rgb(74, 134, 119)';
	}

	static get Red() {
		return 'rgb(120, 72, 61)';
	}

	static get SocketUrl() {
		return 'https://streamer.cryptocompare.com/';
	}

	static get SocketGetArray() {
		return ['5~CCCAGG~BTC~USD', '5~CCCAGG~ETH~USD', '5~CCCAGG~LTC~USD'];
	}

	static get UpArrow() {
		return '&#8593;';
	}

	static get DownArrow() {
		return '&#8595;';
	}

	static get SideArrow() {
		return '&#8594;';
	}

	static get MaxRotate() {
		return 180;
	}
}

class Coin {
	constructor() {
		this.price = 0;
		this.lastPrice = 0;
		this.yesterdayPrice = 0;
		this.lastUpdated = 0;
		this.rotateValue = 90;
	}

	selectCoin() {
		$(`#${this.buttonId}`).addClass(`${this.selectedClass}`);
	}
}

class Bitcoin extends Coin {
	constructor() {
		super();
		this.hasInit = false;
		this.buttonId = 'btc-button';
		this.selectedClass = 'selected-btc';
		this.imgUrl = 'assets/btc-coaster.gif';
	}
}

class Ether extends Coin {
	constructor() {
		super();
		this.buttonId = 'eth-button';
		this.selectedClass = 'selected-eth';
		this.imgUrl = 'assets/eth-coaster.gif';
	}
}

class Litecoin extends Coin {
	constructor() {
		super();
		this.buttonId = 'ltc-button';
		this.selectedClass = 'selected-ltc';
		this.imgUrl = 'assets/ltc-coaster.gif';
	}
}

(function init() {
	let ether = new Ether();
	let bitcoin = new Bitcoin();
	let litecoin = new Litecoin();

	let currentCoin = bitcoin;

	// ENUM: leavingScreen, enteringScreen, inScreen;
	let currentState = 'enteringScreen';

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
	});
	
	let animateInitialEntrance = () => {
		$('.heading-container').removeClass('initial-hide');
		getIncomingRotation(bitcoin);
		// TODO: add -webkit etc to this css jquery function
		$('#coaster').css({'transform': `translate(0px, 0px) rotate(${bitcoin.rotateValue}deg)` });
		$('#loading').css({'opacity': '0'});

		$('#coaster').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', () => {
			currentState = 'inScreen';
			bitcoin.hasInit = true;
		});
	}

	let timerTick = () => {
		setInterval(() => {
			Object.keys(coinDict).forEach(c => {
				coinDict[c].lastUpdated += 1;
			});

			$('#countdown').text(currentCoin.lastUpdated);
		}, 1000);
	}

	let initSocket = () => {
		var socket = io.connect(Constants.SocketUrl);
		var subscription = Constants.SocketGetArray;

		socket.emit('SubAdd', { subs: subscription });

		socket.on("m", (message) => {
			var messageType = message.substring(0, message.indexOf("~"));
			var res = {};
			if (messageType === CCC.STATIC.TYPE.CURRENTAGG) {
				res = CCC.CURRENT.unpack(message);
				processUpdate(res);
			}
		});
	}

	let processUpdate = (update) => {
		let processCoin = coinDict[update.FROMSYMBOL];

		if (!processCoin) {
			throw 'Coin not found in dictionary';
		}

		if (!bitcoin.hasInit && processCoin === bitcoin && bitcoin.price !== 0 && bitcoin.yesterdayPrice !== 0) {
			animateInitialEntrance();
		}

		if (update.PRICE) {
			processCoin.lastPrice = processCoin.price;
			processCoin.price = update.PRICE;
			processCoin.lastUpdated = -1;

			if (currentCoin === processCoin) {
				updatePriceInfo();
			}
		}

		if (update.OPENHOUR) {
			processCoin.yesterdayPrice = update.OPENHOUR;
		}
	}

	let initCoin = function (coin) {
		$(`#${coin.buttonId}`).click(() => {
			if (currentCoin === coin || currentState !== 'inScreen') {
				return;
			}

			transitionCoin(coin);
		});
	}

	let switchCoin = function (coin) {
		transitionCoin(coin);
	}

	let transitionCoin = (incomingCoin) => {
		const x = Math.cos(((currentCoin.rotateValue - 90) * (Math.PI / 180))) * 1000;
		const y = Math.sin(((currentCoin.rotateValue - 90) * (Math.PI / 180))) * 1000;

		let transitionOut = () => {
			$('#coaster').addClass('notransition');
			$('#coaster').css({ 'transform': `rotate(${currentCoin.rotateValue}deg)` });
			$('#coaster').removeClass('notransition');

			currentState = 'leavingScreen';
			$('#coaster').css({ 'transform': `translate(${x}px, ${y}px) rotate(${currentCoin.rotateValue}deg)` });
		}

		let transitionIn = () => {
			getIncomingRotation(incomingCoin);

			$('#coaster').addClass('notransition');
			const incomingX = -Math.cos(((incomingCoin.rotateValue - 90) * (Math.PI / 180))) * 1000;
			const incomingY = -Math.sin(((incomingCoin.rotateValue - 90) * (Math.PI / 180))) * 1000;
			$('#coaster').css({ 'transform': `translate(${incomingX}px, ${incomingY}px) rotate(${incomingCoin.rotateValue || 90}deg)` });

			$('#coaster')[0].offsetHeight; // This refreshes the browser animation cache to be able to immediately transition something
			$('#coaster').removeClass('notransition');

			$('#coaster').css({'transform': `translate(0px, 0px) rotate(${incomingCoin.rotateValue}deg)` });

			updateCoinInfo(incomingCoin);
		}

		$("#coaster").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", () => {
			switch (currentState) {
				case 'leavingScreen':
					transitionIn();
					currentState = 'enteringScreen';
					break;
				case 'enteringScreen':
					currentState = 'inScreen';
					break;
			}
		});

		if (currentState = 'inScreen') {
			transitionOut();
		}
	};

	let getIncomingRotation = (coin) => {
		const delt = coin.price - coin.yesterdayPrice;
		let rotationFactor = 180 - (90 + (delt / coin.price) * 1000);
		
		if (rotationFactor > Constants.MaxRotate) {
			rotationFactor = Constants.MaxRotate;
		} else if (rotationFactor < 0) {
			rotationFactor = 0;
		}
		
		coin.rotateValue = rotationFactor;
	}

	let updateCoinInfo = (coin) => {
		Object.keys(coinDict).forEach(c => {
			let coin = coinDict[c];
			$(`#${coin.buttonId}`).removeClass(coin.selectedClass);
		});

		coin.selectCoin();

		$("#coaster").attr("src", coin.imgUrl);
		$("#countdown").text(coin.lastUpdated);

		currentCoin = coin;
		updatePriceInfo();
	}

	let updatePriceInfo = (coin) => {
		const price = currentCoin.price;
		const lastPrice = currentCoin.lastPrice;

		updateYesterdayPrice();

		$('#price')
			.text(`$${price} USD`)
			.addClass('grow');

		setTimeout(() => {
			$('#price').removeClass('grow');
		}, 1000);

		const delta = Math.round(Math.abs(price - lastPrice) * 100) / 100;
		const rotationFactor = (delta / currentCoin.price) * 15000;
		
		if (lastPrice === price || price === 0 || price === delta) {
			priceStable();
		} else if (price > lastPrice) {
			priceIncrease(delta, rotationFactor);
		} else {
			priceDecrease(delta, rotationFactor);
		}
	}

	let updateYesterdayPrice = () => {
		$('#yesterday-price').text(`$${currentCoin.yesterdayPrice} USD `);

		const yesterdayDelta = Math.round((currentCoin.price - currentCoin.yesterdayPrice) * 100) / 100;
		if (currentCoin.price >= currentCoin.yesterdayPrice) {
			$('#yesterday-price')
				.css('color', Constants.Green)
				.append(`(${Constants.UpArrow} $${Math.abs(yesterdayDelta)})`);
		} else {
			$('#yesterday-price')
				.css('color', Constants.Red)
				.append(`(${Constants.DownArrow} $${Math.abs(yesterdayDelta)})`);
		}
	}

	let priceStable = () => {
		colorText('grey');

		$('#delta').html(`(${Constants.SideArrow} $0)`);
	}

	let priceIncrease = (delta, rotationFactor) => {
		$('#delta').html(`(${Constants.UpArrow} $${delta})`);
		colorText(Constants.Green);
		
		if (currentCoin.rotateValue - rotationFactor > 0) {
			currentCoin.rotateValue -= rotationFactor;
		} else {
			currentCoin.rotateValue = 0;
		}

		changeDirection(currentCoin.rotateValue);
	}

	let priceDecrease = (delta, rotationFactor) => {
		$('#delta').html(`(${Constants.DownArrow} $${delta})`);
		colorText(Constants.Red);
		
		if (currentCoin.rotateValue + rotationFactor < Constants.MaxRotate) {
			currentCoin.rotateValue += rotationFactor;
		} else {
			currentCoin.rotateValue = Constants.MaxRotate;
		}

		changeDirection(currentCoin.rotateValue);
	}

	let changeDirection = (direction) => {
		if (currentState !== 'inScreen') {
			return;
		}

		$('#coaster')
			.css({ 'transform': `rotate(${direction}deg)` })
			.css({ '-ms-transform': `rotate(${direction}deg)` })
			.css({ '-webkit-transform': `rotate(${direction}deg)` });
	}

	let colorText = (rgb) => {
		$('#price').css('color', rgb);
		$('#delta').css('color', rgb);
	}
}());
