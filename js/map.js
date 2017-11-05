var map;
var markers = [];
// this is my locations list 
var locations = [
   {
      title: 'King Saud University',
      location:
      {
         lat: 24.716231,
         lng: 46.618975
      },
   },
   {
      title: 'Masmak fort',
      location:
      {
         lat: 24.631204,
         lng: 46.713337
      }
   },
   {
      title: 'King Abdullah Financial District',
      location:
      {
         lat: 24.761975,
         lng: 46.640359
      }
   },
   {
      title: 'King Abdul Aziz Historical Centre',
      location:
      {
         lat: 24.648295,
         lng: 46.710917
      }
   },
   {
      title: 'King Abdulaziz Public Library',
      location:
      {
         lat: 24.710813,
         lng: 46.748464
      }
   }

];
//  this function displays  the map
function initMap()
   {
      map = new google.maps.Map(document.getElementById(
         'map'),
      {
         center:
         {
            lat: 24.699200,
            lng: 46.6853925
         },
         zoom: 12,
         mapTypeControl: false
      });

      var bounds = new google.maps.LatLngBounds();
      var Infowindow = new google.maps.InfoWindow();
      for (var i = 0; i < locations.length; i++)
      {
         var position = locations[i].location;
         var title = locations[i].title;
         // diclaration of marker
         var marker = new google.maps.Marker(
         {
            position: position,
            title: title,
            animation: google.maps
               .Animation.DROP,
            id: i,
            map: map
         });

         bounds.extend(marker.position);
         locations[i].location = marker;
         // push the marker to the array
         markers.push(marker);
         marker.addListener('click', clc);
      }

      function clc()
      {
         populateInfoWindow(this, Infowindow);
         this.setAnimation(google.maps.Animation.BOUNCE);
         bounceTimer(this, marker);
      }

      function bounceTimer(marker)
      {
         setTimeout(function()
         {
            marker.setAnimation(null);
         },
          1500);
      }

   }
   // the function  displays infowindow and API
function populateInfoWindow(marker, infowindow)
{
   var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title +'&format=json&callback=wikiCallback';
   var data = '<h4>' + marker.title +'</h4><hr><p><p>Coordinates</p>' +
      marker.position;
   $.ajax(
   {
      url: wikiUrl,dataType: 'jsonp', jsonp: "callback", success: function( response)
      {
         var articleList =response[1];
         for (var i = 0; i < articleList.length; i++
         )
         {
            var articeSet = articleList[i];
            var url = 'http://en.wikipedia.org/wiki/' + articeSet;
            data = data + '</p><a href=\"' + url + '\"> For more information</a>';
         }
         infowindow.setContent(data);
         infowindow.open(map, marker);
         marker.setAnimation( google.maps.Animation.BOUNCE);

      }
   }).fail(function() {
        alert("Error failed to generate API");
    });

}

// filtering the markers and list Useing knockout 
function AppViewModel()
   {
      this.search = ko.observable('');
      this.locations = ko.observableArray(locations);
      this.title = ko.observable();


      this.filteredLocation = ko.computed(
         function()
         {
            var filter = this.search().toLowerCase();
            if (!filter)
            {
               // displays the markers 
               for (var i = 0; i <markers.length; i++)
               {
                  markers[i].setVisible(  true);
               }

               return this.locations();
            }
            else
            {
               var hide = ko.utils.arrayFilter(this.locations(),function(locations)
                  {
                     return locations.title.toLowerCase().indexOf( filter) ==-1;
                  });

               return ko.utils.arrayFilter(this.locations(),function(locations)
                  {
                     for (var i = 0; i <hide.length; i++)
                     {
                        hide[i].location.setVisible(false);
                     }
                     return locations
                        .title.toLowerCase().indexOf( filter) !=-1;
                  });
            }
         }, this);
      // when clicking on the list the marker gets the clicks
      this.toggleMarker = function(marker)
      {
         google.maps.event.trigger(marker.location, 'click');
      };

   }
   //onerror
function googleError()
{
   alert("404 Page Not Found!");

}


ko.applyBindings(new AppViewModel());

function openNav()
{
   document.getElementById("mySidenav")
      .style.display = "block";
}

function closeNav()
{
   document.getElementById("mySidenav")
      .style.display = "none";
}
