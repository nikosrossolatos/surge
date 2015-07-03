(function(){
  
  window.surge = Surge();

	$(document).on('click', '#test', function(event) {
		event.preventDefault();
		/* Act on the event */

		surge.emit({event:'fuck off',message:'ping'})

	});
	$(document).on('click', '#test2', function(event) {
  	event.preventDefault();
  	/* Act on the event */

  	surge.subscribe('room1');
  	
  });
  $(document).on('submit', '#joinRoomForm', function(event) {
  	event.preventDefault();
  	/* Act on the event */
  	var room = $(this).find('input').val();
  	surge.subscribe(room);
  	
  });
   $(document).on('submit', '#leaveRoomForm', function(event) {
  	event.preventDefault();
  	/* Act on the event */
  	var room = $(this).find('input').val();
  	surge.unsubscribe(room);
  	
  });
	$(document).on('click', '#test3', function(event) {
  	event.preventDefault();
  	/* Act on the event */
  	var x = surge.connection.rooms;
  	alert("You are in rooms : "+x);
  	
  });

  
  surge.connection.watch('state',function(id, oldval, newval){
  	$('#state').html(newval);
  });


	surge.on('surge-joined_room', function() {
		$('#rooms').html('');
		for (var i = 0; i < surge.connection.rooms.length; i++) {
			$('#rooms').append(' '+surge.connection.rooms[i])
		};
	});
	surge.on('surge-left_room', function() {
		$('#rooms').html('');
		for (var i = 0; i < surge.connection.rooms.length; i++) {
			$('#rooms').append(' '+surge.connection.rooms[i])
		};
	});

})()