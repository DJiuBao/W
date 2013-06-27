      var map;
      function initialize() {
        var myOptions = {
          zoom: 12,
          center: new google.maps.LatLng(39.921934,116.462578),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById('map_canvas'),myOptions);
      }