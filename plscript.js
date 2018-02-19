function populate()
{
  return function(req, res){
    //container object stores query data in "items" and body data in "itemsB"
    var container = {items: [], itemsB: []};
    var x = 0;
    
    //Store all query names and values
    for (var d in req.query)
    {
      var obj = {'name':d, 'value':req.query[d]};
      container.items[x] = obj;
      x++;
    }
    
    //Add query data to empty string; if string is still empty, req is GET
    var reqStr = "";
    for (var d in req.body)
    {
      reqStr += d += req.body[d];
    }
    
    //If non-empty string, render page for POST request
    if (reqStr !== "")
    {
      x = 0;
      for (var d in req.body)
      {
        var obj = {'name':d, 'value':req.body[d]};
        container.itemsB[x] = obj;
        x++;
      }
      //Render "POST request received"
      res.render('postdata', container);
    }
    
    else
    {
      //Render "GET request received"
      res.render('getdata', container);
    }
  };
}

var trackNames = [];
                  
for (var j = 0; j < 5; j++) {
  trackNames[j] = "" + j + ". ";
  var track1 =  playlist.tracks.items[j];
  trackNames[j] += track1.track.name;
 
}

//Now that everything for an album is retrieved, we can add this information to the DOM
var playlistDisplay = document.createElement("h3");
document.getElementById('insert').appendChild(playlistDisplay);
playlistDisplay.textContent = "Playlist: " + playlist.name;
playlistDisplay.textContent;

var accessToken = 'BQCHETfToaS_XB-kdgUINUr3fS-K1jFb39v6U43ty8iGFQtWIrefDSwvKZUvPzeosyy7rgtDzryJ3ZrZml2jkH8nrfkoEI2jUQJW1jVf0Z6A4cXDfn5Yta9gHWuZvQRhICoqE5n2GTrNSCCFlNePGVvJ8RTvhuBo-8NAHjqx5xZX7-ZJpl6a-nw3BBYC4eb0hc1YNavfOojmNf8_osPvJAAu5jtSX0iqungQK-s85O4AFa3eM85v3Q';

var trackDisplay;
for (var r = 0; r < 3; r++) {
  trackDisplay = document.createElement("h4");
  document.getElementById('insert').appendChild(trackDisplay);
  trackDisplay.textContent = trackNames[r];
}

var areaButton = document.getElementById('area');
document.addEventListener('DOMContentLoaded', function(event){

  areaButton.addEventListener('click', function(event){

    var req = new XMLHttpRequest();
    var url = 'https://api.spotify.com/v1/users/cbigby235/playlists/0e1qHvWEuKNWqNq1ZDTaT3/tracks';

    req.open('GET', url, true);
    req.setRequestHeader('Accept', 'application/json');
    req.setRequestHeader('Authorization', 'Bearer' + accessToken);

    req.addEventListener('load', function(event){
      if(req.status >= 200 && req.status < 400){
        var resObject = JSON.parse(req.responseText);

        console.log(resObject);
      }
      else {
        console.log('Error in network request: ' + req.statusText);
      }});
    req.send(null);

    event.preventDefault();

  });
});