// Utils
var CCC = require('./ccc-streamer-utilities.js');
var io = require('socket.io-client');

// Styles
require('../css/styles.scss');

// Classes
import { Constants } from './constants';
import { Coin, Ether, Bitcoin, Litecoin, Monero, Dash, Ripple, Neo, Nem, OmiseGo } from './coins';

(function init() {
	// ENUM: leavingScreen, enteringScreen, inScreen;
	let currentState = 'enteringScreen';

	let coinDict = {
		'BTC': new Bitcoin(),
		'ETH': new Ether(),
		'LTC': new Litecoin(),
		'XRP': new Ripple(),
		'XMR': new Monero(),
		'DASH': new Dash(),
		'OMG': new OmiseGo(),
		'XEM': new Nem(),
		'NEO': new Neo()
	};

	let currentCoin = coinDict['BTC'];

	$(document).ready(() => {
		timerTick();
		initSocket();

		$('#selected-coin').click(() => {
			toggleMenu();
		});

		$('.overlay').click(() => {
			untoggleMenu();
		});

		$('.more-info').click(() => {
			toggleInfo();
		});

		$('.info-close').click(() => {
			unToggleInfo();
		});

		Object.keys(coinDict).reverse().forEach((coin, index) => { // Reversed because I have to prepend the coins (before the about crypto div)
			renderCoinButton(coinDict[coin], coin, index);
			initCoin(coinDict[coin]);
		});
	});

	let renderCoinButton = (coin, ticker, index) => {
		if (index % 3 === 0) {
			$('.footer-modal').prepend(`<div id="row-${Math.floor(index / 3)}" class="button-row"></div>`);
		}

		$(`.footer-modal #row-${Math.floor(index / 3)}`).prepend(`
			<div id="${coin.buttonId}" class="button" style="background-color:${coin.buttonColor}">
				${ticker}
			</div>
		`);
	};
	
	let animateInitialEntrance = () => {
		currentCoin.hasInit = true;
		
		$('.heading-container').removeClass('initial-hide');
		getIncomingRotation(currentCoin);
		// TODO: add -webkit etc to this css jquery function
		$('#coaster').css({'transform': `translate(0px, 0px) rotate(${currentCoin.rotateValue}deg)` });
		$('#loading').css({'opacity': '0'});

		$('#coaster').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', () => {
			currentState = 'inScreen';
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

		if (!currentCoin.hasInit && processCoin === currentCoin && currentCoin.price !== 0 && currentCoin.yesterdayPrice !== 0) {
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

			updateSelectedButton(coin);
			untoggleMenu();
			transitionCoin(coin);
		});
	}

	let updateSelectedButton = (coin) => { 
		$('#selected-coin').css('background-color', coin.buttonColor);
		$('#selected-coin .ticker').html(coin.name);
		$("#selected-coin .logo").attr("src", coin.logo);
	};

	let toggleMenu = function () {
		$('.footer-modal').css('top', '57.5%');
		$('.overlay').addClass('toggled');

		$('.overlay').css('pointer-events', 'all');
	}

	let untoggleMenu = () => {
		$('.overlay').css('pointer-events', 'none');
		$('.overlay').removeClass('toggled');
		$('.footer-modal').css('top', '100%');
	};

	let toggleInfo = () => {
		$('.info-modal').css('top', '0%');
	};

	let unToggleInfo = () => {
		$('.info-modal').css('top', '100%');
	}

	let switchCoin = function (coin) {
		transitionCoin(coin);
	}

	let transitionCoin = (incomingCoin) => {
		const x = Math.cos(((currentCoin.rotateValue - 90) * (Math.PI / 180))) * getMoveDistance();
		const y = Math.sin(((currentCoin.rotateValue - 90) * (Math.PI / 180))) * getMoveDistance();

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
			const incomingX = -Math.cos(((incomingCoin.rotateValue - 90) * (Math.PI / 180))) * getMoveDistance();
			const incomingY = -Math.sin(((incomingCoin.rotateValue - 90) * (Math.PI / 180))) * getMoveDistance();
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

		const delta = Math.round(Math.abs(price - lastPrice) * 10000) / 10000; // 4 decimal places
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
		$('#delta').html(`${Constants.UpArrow} $${delta}`);
		colorText(Constants.Green);
		
		if (currentCoin.rotateValue - rotationFactor > 0) {
			currentCoin.rotateValue -= rotationFactor;
		} else {
			currentCoin.rotateValue = 0;
		}

		changeDirection(currentCoin.rotateValue);
	}

	let priceDecrease = (delta, rotationFactor) => {
		$('#delta').html(`${Constants.DownArrow} $${delta}`);
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

	let getMoveDistance = () => {
		return (1.5 * $(window).width());
	}
}());
