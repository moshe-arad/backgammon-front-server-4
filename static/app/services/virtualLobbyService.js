angular.module("backgammonApp").factory("VirtualLobby",[function(){
  return {
    virtualGameRooms: [
			{
				name:'Backgammon game 1',
				open_by:'Barack Obama',
				second:'Paris Hilton',
				watchers:[
					'Donald Trump',
					'Abraham Lincoln',
					'Bob Marley'
			]},
			{
				name:'Backgammon game 2',
				open_by:'Oprah Winfrey',
				second:'John F. Kennedy',
				watchers:[
					'David Beckham',
					'Bill Clinton',
					'Kim Kardashian',
					'Michael Phelps'
			]},
			{
				name:'Backgammon game 3',
				open_by:'Marilyn Monroe',
				second:'Howard Stern',
				watchers:[
					'Selena Gomez',
					'Elvis Presley'
			]},
			{
				name:'Backgammon game 4',
				open_by:'Britney Spears',
				second:'Angelina Jolie',
				watchers:[
					'Will Smith',
			]},
			{
				name:'Backgammon game 5',
				open_by:'Steven Spielberg',
				second:'Kurt Cobain',
				watchers:[
					'Charlie Sheen',
					'Justin Timberlake',
					'Andy Warhol'
			]},
			{
				name:'Backgammon game 6',
				open_by:'Katy Perry',
			  second:'Brad Pitt',
				watchers:[
					'Whoopi Goldberg',
					'Elizabeth Taylor'
			]},
			{
				name:'Backgammon game 7',
				open_by:'Cristiano Ronaldo',
				second:'Jim Carrey',
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
