(function(){
  
  var surge = Surge();

  $(document).on('click', '#test', function(event) {
    event.preventDefault();
    /* Act on the event */
    surge.emit('message',{event:'fuck off',message:'ping'})
  });

  surge.on('message', function(message) {
  });

})()