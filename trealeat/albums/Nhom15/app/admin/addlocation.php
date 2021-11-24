<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">

    <link rel="stylesheet" href="../assets/css/global_variable.css">
    <link rel="stylesheet" href="../assets/css/global_variable.css">
    <link rel="stylesheet" href="../assets/css/common.css">
    <link rel="stylesheet" href="../assets/js/richtext/richtext.min.css">
    <script type="text/javascript" src="../assets/js/richtext/jquery.richtext.js"></script>
    <!-- local  -->
  

    <!-- <link rel="stylesheet" href="assets/css/global_variable.css">
    <link rel="stylesheet" href="assets/css/common.css">
    <link rel="stylesheet" href="assets/js/richtext/rchtext.min.css">
    <script type="text/javascript" src="assets/js/richtext/jquery.richtext.js"></script> -->

</head>
<body>
    <div style='max-width: 1080px; margin: 0 auto;'>
        <div id="media-modal"></div>
        <form>
            <div class="form-card">
                <div class="form-card-header">
                General information
                </div>
                <div class="form-card-body">
                    <div class="textfield">
                        <input type="text" name="location_name" 
                            placeholder="enter your name" 
                            id="location_name" 
                        />
                        <label for="location_name">Name</label>
                    </div>
                    <div>
                        <label for="location_description">Description</label>
                        <textarea  id="location_description">

                        </textarea>
                    </div>
                </div>
            </div>
            <div class="form-card">
                <div class="form-card-header">
                    Media
                </div>
                <div class="form-card-body">
                <div class="media-types">
                    <span class='btn btn-save' onclick="addMedia('image')">Image</span>
                    <span class='btn btn-save' onclick="addMedia('YTB')">Video youtobe</span>
                        <span class='btn btn-save' onclick="addMedia('3d')">3D model</span>
                </div>
                <div id="medias">

                </div>
                
                </div>
            </div>
        </form>
    </div>
    <script src="../assets/js/location.js"></script>
    <script>
         $(document).ready(function() {
            $('#location_description').richText();
        });
    </script>
</body>
</html>