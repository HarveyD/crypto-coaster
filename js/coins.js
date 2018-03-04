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
		this.imgUrl = 'assets/coasters/btc-coaster.gif';
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
		this.imgUrl = 'assets/coasters/eth-coaster.gif';
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
		this.imgUrl = 'assets/coasters/ltc-coaster.gif';
		this.buttonColor = '#A6A9AF';
	}
}

export class Monero extends Coin {
	constructor() {
		super();
		this.name = 'Monero';
		this.ticker = 'XMR';
		this.buttonId = 'xmr-button';
		this.imgUrl = 'assets/coasters/xmr-coaster.gif';
		this.buttonColor = '#ee660a';
	}
}

export class Dash extends Coin {
	constructor() {
		super();
		this.name = 'Dash';
		this.ticker = 'DASH';
		this.buttonId = 'dash-button';
		this.imgUrl = 'assets/coasters/dash-coaster.gif';
		this.buttonColor = '#3779c0';
	}
}

export class Ripple extends Coin {
	constructor() {
		super();
		this.name = 'Ripple';
		this.ticker = 'XRP';
		this.buttonId = 'xrp-button';
		this.imgUrl = 'assets/coasters/xrp-coaster.gif';
		this.buttonColor = '#4087b3';
	}
}

export class Neo extends Coin {
	constructor() {
		super();
		this.name = 'Neo';
		this.ticker = 'NEO';
		this.buttonId = 'neo-button';
		this.imgUrl = 'assets/coasters/neo-coaster.gif';
		this.buttonColor = '#87bd47';
	}
}

export class Nem extends Coin {
	constructor() {
		super();
		this.name = 'Nem';
		this.ticker = 'XEM';
		this.buttonId = 'xem-button';
		this.imgUrl = 'assets/coasters/xem-coaster.gif';
		this.buttonColor = '#5bb6ab';
	}
}

export class OmiseGo extends Coin {
	constructor() {
		super();
		this.name = 'OmiseGo';
		this.ticker = 'OMG';
		this.buttonId = 'omg-button';
		this.imgUrl = 'assets/coasters/omg-coaster.gif';
		this.buttonColor = '#2355d9';
	}
}