export class Coin {
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

export class Bitcoin extends Coin {
	constructor() {
		super();
		this.name = 'Bitcoin';
		this.ticker = 'BTC';
		this.hasInit = false;
		this.buttonId = 'btc-button';
		this.selectedClass = 'selected-btc';
		this.imgUrl = require('../assets/coasters/btc-coaster.gif');
		this.logo = require('../assets/coin-svg/btc.svg');
		this.buttonColor = '#FF9900';
	}
}

export class Ether extends Coin {
	constructor() {
		super();
		this.name = 'Ether';
		this.ticker = 'ETH';
		this.buttonId = 'eth-button';
		this.selectedClass = 'selected-eth';
		this.imgUrl = require('../assets/coasters/eth-coaster.gif');
		this.logo = require('../assets/coin-svg/eth.svg');
		this.buttonColor = '#516BB1';
	}
}

export class Litecoin extends Coin {
	constructor() {
		super();
		this.name = 'Litecoin';
		this.ticker = 'LTC';
		this.buttonId = 'ltc-button';
		this.selectedClass = 'selected-ltc';
		this.imgUrl = require('../assets/coasters/ltc-coaster.gif');
		this.logo = require('../assets/coin-svg/ltc.svg');
		this.buttonColor = '#A6A9AF';
	}
}

export class Monero extends Coin {
	constructor() {
		super();
		this.name = 'Monero';
		this.ticker = 'XMR';
		this.buttonId = 'xmr-button';
		this.imgUrl = require('../assets/coasters/xmr-coaster.gif');
		this.logo = require('../assets/coin-svg/xmr.svg');
		this.buttonColor = '#ee660a';
	}
}

export class Dash extends Coin {
	constructor() {
		super();
		this.name = 'Dash';
		this.ticker = 'DASH';
		this.buttonId = 'dash-button';
		this.imgUrl = require('../assets/coasters/dash-coaster.gif');
		this.logo = require('../assets/coin-svg/dash.svg');
		this.buttonColor = '#3779c0';
	}
}

export class Ripple extends Coin {
	constructor() {
		super();
		this.name = 'Ripple';
		this.ticker = 'XRP';
		this.buttonId = 'xrp-button';
		this.imgUrl = require('../assets/coasters/xrp-coaster.gif');
		this.logo = require('../assets/coin-svg/xrp.svg');
		this.buttonColor = '#4087b3';
	}
}

export class Neo extends Coin {
	constructor() {
		super();
		this.name = 'Neo';
		this.ticker = 'NEO';
		this.buttonId = 'neo-button';
		this.imgUrl = require('../assets/coasters/neo-coaster.gif');
		this.logo = require('../assets/coin-svg/neo.svg');
		this.buttonColor = '#87bd47';
	}
}

export class Nem extends Coin {
	constructor() {
		super();
		this.name = 'Nem';
		this.ticker = 'XEM';
		this.buttonId = 'xem-button';
		this.imgUrl = require('../assets/coasters/xem-coaster.gif');
		this.logo = require('../assets/coin-svg/xem.svg');
		this.buttonColor = '#5bb6ab';
	}
}

export class OmiseGo extends Coin {
	constructor() {
		super();
		this.name = 'OmiseGo';
		this.ticker = 'OMG';
		this.buttonId = 'omg-button';
		this.imgUrl = require('../assets/coasters/omg-coaster.gif');
		this.logo = require('../assets/coin-svg/omg.svg');
		this.buttonColor = '#2355d9';
	}
}