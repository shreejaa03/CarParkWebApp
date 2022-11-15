
       fetch("https://api.data.gov.sg/v1/transport/carpark-availability") // get carpark availability api
       .then(function (response) {
         return response.json();
       })
       .then(function (data) {
         text = JSON.stringify(data);
         localStorage.setItem("carparkAvailibity", text);
       });

       function findcarparkinfo(target) {
       text = localStorage.getItem("carparkAvailibity");

       data = JSON.parse(text);

       for (i = 0; i < data.items[0].carpark_data.length; i++) {
         if (data.items[0].carpark_data[i].carpark_number == target) {
           avail_lots =
             data.items[0].carpark_data[i].carpark_info[0].lots_available;
           total_lots =
             data.items[0].carpark_data[i].carpark_info[0].total_lots;

             return [avail_lots,total_lots];
         }
       }


     }

     function calculateDistance(){

     text=localStorage.getItem("nearbycarpark");
       nearbycarpark=JSON.parse(text);
       text = localStorage.getItem("search coordinates");
       coordinates = JSON.parse(text);
       var origin=new google.maps.LatLng(coordinates.latitude, coordinates.longitude);
       var destination=[];
       for(i=0;i<nearbycarpark.length;i++)
       {
         if(i>20) //api limit
           break;
         destination.push({ lat: nearbycarpark[i].x_coord, lng: nearbycarpark[i].y_coord})
       }

        var service = new google.maps.DistanceMatrixService();
       service.getDistanceMatrix(
      {
           origins: [origin],
          destinations: destination,
          travelMode: 'WALKING',
          avoidHighways: false,
           avoidTolls: false,
         }, get_distance);

       }

     function initMap() {
       // Map options
       text = localStorage.getItem("search coordinates");
       coordinates = JSON.parse(text);

       var options = {
         zoom: 16,
         center: { lat: coordinates.latitude, lng: coordinates.longitude },
         zoomControl: false,
         mapTypeControl: false,
         scaleControl: false,
         streetViewControl: false,

       };

       // New map
       var map = new google.maps.Map(document.getElementById("map"), options);




         // markers array has first element: the search coordinates
       var markers = [

         {
           coords: { lat: coordinates.latitude, lng: coordinates.longitude },

         },
       ];

       // generating info window for each car park( rates, availability etc)
       text=localStorage.getItem("nearbycarpark");
       nearbycarpark=JSON.parse(text);
       for(i=0;i<nearbycarpark.length;i++)
       {



         if(nearbycarpark[i].lots_available==null)
           nearbycarpark[i].lots_available="N/A";


           str=nearbycarpark[i].address+"<p></p>"+" Available: "+nearbycarpark[i].lots_available+"<p></p>"+"Walking duration: "+nearbycarpark[i].duration+"<p></p>"+"Weekday rates: "+nearbycarpark[i].weekdayRate+"/30mins"+"<p></p>"+"Sat rates: "+nearbycarpark[i].satdayRate+"/30mins"+"<p></p>"+"Sun rates: "+nearbycarpark[i].sunPHRate+"/30mins<p></p>";



         markers.push( {
           coords: { lat: nearbycarpark[i].x_coord, lng: nearbycarpark[i].y_coord },
           iconImage:
             "http://maps.google.com/mapfiles/ms/icons/parkinglot.png",
           content: str,
         },)
       }

       // Loop through markers get nearest 5(6 including destination) list sorted according to distance
       for (var i = 0; i <6; i++) {
         // Add marker
         if(i==nearbycarpark.length+1)
           break;
         if(markers[i]!=null)
           addMarker(markers[i]);
       }

       function createmarker() {}

       // Add Marker Function
       function addMarker(props) {
         var marker = new google.maps.Marker({
           position: props.coords,
           map: map,
           //icon:props.iconImage
         });

         // Check for customicon
         if (props.iconImage) {
           // Set icon image
           marker.setIcon(props.iconImage);
         }

         // Check content
         if (props.content) {
           var infoWindow = new google.maps.InfoWindow({
             content: props.content,
           });

           marker.addListener("click", function () {
             infoWindow.open(map, marker);
           });
         }
       }
     }

function get_distance(response, status) {

text=localStorage.getItem("nearbycarpark");
nearbycarpark=JSON.parse(text);

if (status == 'OK') {
 var origins = response.originAddresses;
 var destinations = response.destinationAddresses;

 for (var i = 0; i < origins.length; i++) {
   var results = response.rows[i].elements;

   for (var j = 0; j < results.length; j++) {
     var element = results[j];
     nearbycarpark[j].distance = element.distance.text;
     nearbycarpark[j].duration = element.duration.text;
     var from = origins[i];
     var to = destinations[j];
   }
 }
}

for(i=1;i<nearbycarpark.length;i++) //arrange carpark according to duration
{
 for(j=i;j>0;j--)
           {
               d1=nearbycarpark[j-1].duration;
               d2=nearbycarpark[j].duration;
               if(d1>d2)
               {
                   temp= nearbycarpark[j];
                   nearbycarpark[j]=nearbycarpark[j-1];
                   nearbycarpark[j-1]=temp;
               }
               else
                   break;
           }



}



 text=JSON.stringify(nearbycarpark);
 localStorage.setItem("nearbycarpark",text);


 initMap(); //generate map
}
