export class Constants {
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
		return [
			'5~CCCAGG~BTC~USD', 
			'5~CCCAGG~ETH~USD', 
			'5~CCCAGG~LTC~USD', 
			'5~CCCAGG~XMR~USD', 
			'5~CCCAGG~DASH~USD',
			'5~CCCAGG~XRP~USD',
			'5~CCCAGG~NEO~USD',
			'5~CCCAGG~OMG~USD',
			'5~CCCAGG~XEM~USD'
		];
	}

	static get UpArrow() {
		return '<i class="fa fa-arrow-up" aria-hidden="true"></i>';
	}

	static get DownArrow() {
		return '<i class="fa fa-arrow-down" aria-hidden="true"></i>';
	}

	static get SideArrow() {
		return '<i class="fa fa-arrow-right" aria-hidden="true"></i>';
	}

	static get MaxRotate() {
		return 180;
	}
}