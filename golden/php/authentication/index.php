<html>
  <head>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js">
    </script>
    <link rel="stylesheet"
          href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
    <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js">
    </script>
  </head>
  <body>
    <div class="container" style="margin-top:40px">
      <div class="KalturaUser"></div>
      <script>
        var element = $('.KalturaUser').last();
        element[0].loadData = function() {
          $('.KalturaUser').last().load('getUser.php');
        }
        element[0].loadData();
      </script>
    </div>
  </body>
</html>
