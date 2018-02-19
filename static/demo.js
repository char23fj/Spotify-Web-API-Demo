/* global access_Token */

(function() {

var stateKey = 'spotify_auth_state';

/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
     hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var userProfileSource = document.getElementById('user-profile-template').innerHTML,
    userProfileTemplate = Handlebars.compile(userProfileSource),
    userProfilePlaceholder = document.getElementById('user-profile');

    oauthSource = document.getElementById('oauth-template').innerHTML,
    oauthTemplate = Handlebars.compile(oauthSource),
    oauthPlaceholder = document.getElementById('oauth');

var params = getHashParams();

var access_token = params.access_token,
    state = params.state,
    storedState = localStorage.getItem(stateKey);
    
var user_id = '';

if (access_token && (state == null || state !== storedState)) {
  alert('There was an error during the authentication');
} else {
  localStorage.removeItem(stateKey);
  if (access_token) {
    $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          userProfilePlaceholder.innerHTML = userProfileTemplate(response);
          console.log(response);
          if (response.display_name === null){
            document.getElementById('dNameH').textContent = "Logged in as " + response.id;
            document.getElementById('dNameD').textContent = response.id;
          }
          $('#login').hide();
          $('#loggedin').show();

          user_id = response.id;
          getPL(access_token, user_id);
        }
    });
  } else {
      $('#login').show();
      $('#loggedin').hide();
  }

  document.getElementById('login-button').addEventListener('click', function(access_token) {

    var client_id = '434bdee30b05413dbea415c6a83c8dbf'; // Your client id
    var redirect_uri = 'http://flip2.engr.oregonstate.edu:8888/auth.html';

    var state = generateRandomString(16);

    localStorage.setItem(stateKey, state);
    var scope = 'user-read-private user-read-email';
    scope += ' playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative';

    var url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
    url += '&state=' + encodeURIComponent(state);
    window.location = url;
  }, false);
}
/*  document.addEventListener('DOMContentLoaded', function(event){
  if (user_id !== ''){
      getPL(access_token, user_id);
  }
  event.preventDefault();
  });
*/
  function getPL(token, id){
    var button1 = document.createElement('button');
    button1.textContent = "Get Playlists";
    button1.class = "btn btn-primary btn-medium btn-block";
    button1.style = "top-margin: 20px";
    document.getElementById('bDiv').appendChild(button1);
    button1.addEventListener('click', function(event){

      var req = new XMLHttpRequest();
      var url2 = 'https://api.spotify.com/v1/users/' + id + '/playlists';
      var lists = [];

      req.open('GET', url2, true);
      req.setRequestHeader('Accept', 'application/json');
      req.setRequestHeader('Authorization', 'Bearer ' + token);

      req.addEventListener('load', function(event){
        if(req.status >= 200 && req.status < 400){
          var plObject = JSON.parse(req.responseText);
          var tdiv = document.getElementById('tDiv');
          var table = document.createElement('table');
          tdiv.appendChild(table);
          for (var x = 0; x < plObject.items.length; x++)
          {
            lists[x] = {
              'id': plObject.items[x].id,
              'name': plObject.items[x].name
              };
            
            var tRow = document.createElement('tr');
            table.appendChild(tRow);
            var tCell1 = document.createElement('td');
            tRow.appendChild(tCell1);
            var tCell2 = document.createElement('td');
            tRow.appendChild(tCell2);
            tCell1.textContent = lists[x].name;
            var btn = document.createElement('button');
            
            tCell2.appendChild(btn);
            btn.textContent = 'Get Songs';
            btn.value = lists[x].id;
            btn.addEventListener('click', showSongs(lists[x].id));
            
            function showSongs(pID){
              return function(event){
                var req = new XMLHttpRequest();
                var url3 = 'https://api.spotify.com/v1/users/' + id + '/playlists/';
                url3 += pID + '/tracks';
                var songs = [];

                req.open('GET', url3, true);
                req.setRequestHeader('Accept', 'application/json');
                req.setRequestHeader('Authorization', 'Bearer ' + token);

                req.addEventListener('load', function(event){
                  if(req.status >= 200 && req.status < 400){
                    var trObject = JSON.parse(req.responseText);
                    var table2 = document.createElement('table');
                    var tdiv2 = document.getElementById('tDiv2');
                    tdiv2.appendChild(table2);
                    for (var a = 0; a < trObject.items.length; a++)
                    {
                      var track = trObject.items[a].track;
                      lists[a] = {
                        'id': track.id,
                        'name': track.name,
                        'artist': track.artists[0].name
                        };
                      
                      var tRow1 = document.createElement('tr');
                      table2.appendChild(tRow1);
                      var tCell3 = document.createElement('td');
                      tRow1.appendChild(tCell3);
                      var tCell4 = document.createElement('td');
                      tRow1.appendChild(tCell4);
                      tCell3.textContent = track.name;
                      tCell3.width = "500px";
                      tCell4.textContent = track.artists[0].name;
                      tCell4.width = "500px";
                    }
                  }
                  else {
                    console.log('Error in network request: ' + req.statusText);
                  }});
                req.send(null);
                
                event.preventDefault();
              };

            }
          }
        }
        else {
          console.log('Error in network request: ' + req.statusText);
        }});
        req.send(null);

        event.preventDefault();    
      });
  }
})();

