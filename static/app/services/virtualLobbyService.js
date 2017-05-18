angular.module("backgammonApp").factory("VirtualLobby",[function(){
  return {
    virtualGameRooms: [
			{
				name:'BackgammonGameA',
				openBy:'Barack Obama',
				secondPlayer:'Paris Hilton',
				watchers:[
					'Donald Trump',
					'Abraham Lincoln',
					'Bob Marley'
			]},
			{
				name:'BackgammonGameB',
				openBy:'Oprah Winfrey',
				secondPlayer:'John F. Kennedy',
				watchers:[
					'David Beckham',
					'Bill Clinton',
					'Kim Kardashian',
					'Michael Phelps'
			]},
			{
				name:'BackgammonGameC',
				openBy:'Marilyn Monroe',
				secondPlayer:'Howard Stern',
				watchers:[
					'Selena Gomez',
					'Elvis Presley'
			]},
			{
				name:'BackgammonGameD',
				openBy:'Britney Spears',
				secondPlayer:'Angelina Jolie',
				watchers:[
					'Will Smith',
			]},
			{
				name:'BackgammonGameE',
				openBy:'Steven Spielberg',
				secondPlayer:'Kurt Cobain',
				watchers:[
					'Charlie Sheen',
					'Justin Timberlake',
					'Andy Warhol'
			]},
			{
				name:'BackgammonGameF',
				openBy:'Katy Perry',
			  secondPlayer:'Brad Pitt',
				watchers:[
					'Whoopi Goldberg',
					'Elizabeth Taylor'
			]},
			{
				name:'BackgammonGameG',
				openBy:'Cristiano Ronaldo',
				secondPlayer:'Jim Carrey',
				watchers:[
					'Halle Berry',
					'Miley Cyrus',
					'Carrie Fisher'
			]},
		],

    //users name in lobby
    usersInLobby : ['Stevie Wonder', 'Courtney Love', 'Bob Hope', 'Justin Bieber', 'Mel Gibson', 'Howard Hughes', 'Woody Allen', 'Tiger Woods', 'Robert De Niro', 'Jennifer Lopez']
  };
}]);
