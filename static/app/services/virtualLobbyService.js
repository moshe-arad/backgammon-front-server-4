angular.module("backgammonApp").factory("VirtualLobby",[function(){
  return {
    virtualGameRooms: [
			{
				name:'Backgammon game 1',
				openBy:'Barack Obama',
				secondPlayer:'Paris Hilton',
				watchers:[
					'Donald Trump',
					'Abraham Lincoln',
					'Bob Marley'
			]},
			{
				name:'Backgammon game 2',
				openBy:'Oprah Winfrey',
				secondPlayer:'John F. Kennedy',
				watchers:[
					'David Beckham',
					'Bill Clinton',
					'Kim Kardashian',
					'Michael Phelps'
			]},
			{
				name:'Backgammon game 3',
				openBy:'Marilyn Monroe',
				secondPlayer:'Howard Stern',
				watchers:[
					'Selena Gomez',
					'Elvis Presley'
			]},
			{
				name:'Backgammon game 4',
				openBy:'Britney Spears',
				secondPlayer:'Angelina Jolie',
				watchers:[
					'Will Smith',
			]},
			{
				name:'Backgammon game 5',
				openBy:'Steven Spielberg',
				secondPlayer:'Kurt Cobain',
				watchers:[
					'Charlie Sheen',
					'Justin Timberlake',
					'Andy Warhol'
			]},
			{
				name:'Backgammon game 6',
				openBy:'Katy Perry',
			  secondPlayer:'Brad Pitt',
				watchers:[
					'Whoopi Goldberg',
					'Elizabeth Taylor'
			]},
			{
				name:'Backgammon game 7',
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
