<?php
	// require_once('../lib/functions.php');

	// $d = initializeApp('streamline');	
	// $ni = sizeof($d['items']);
	// $iu = array($ni);	

	// for($i=0;$i<$ni;$i++){
	// 	$itemid = $d['items'][$i];
	// 	$idata 	= fetchItemData($itemid);
	// }
?>

<!DOCTYPE HTML>
<html>

<head>
<title><?php echo $d['title']; ?></title>
<meta name="viewport" content="width=device-width, initial-scale=1.0"> 
<!--test template style-->
<!--Easy Scroll Dots style-->
<style>
</style>
<link rel="stylesheet" href="assets/css/common.css">
<!-- <link rel="stylesheet" href="assets/css/index.css"> -->
<link href='https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css' rel='stylesheet'>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
</head>
<style>
   #messages {
       width: 350px;
       max-width: 100%;

       position: fixed;
       right: 0;
       top: 1rem;
       z-index: 33;
       /* background-color: #f1f1f1; */
       overflow: hidden;
       height: 100vh;
       padding: 0.5rem;
   }

</style>
<body >
    <button class="btn-btn-save" onclick="showToast()">Toast</button>
        <div id="messages">
            <!-- <div class="toast">
                <div class="toast__icon">
                 <i class='bx bx-check-circle'></i>
                </div>
                <div class="toast__body">
                    <div class="toast__title">
                        Thành công
                    </div>
                    <div class="toast__message">
                        Success load
                    </div>
                </div>
                <div class="toast__close">
                <i class='bx bx-x'></i>
                </div>

            </div> -->
        </div>
</div>
<script src="assets/js/common.js"></script>
</script>
<!-- <script src="assets/js/index.js"></script> -->
<script>
   let toast = {
       type: 'success',
       title: 'Xin Chao',
       message: 'Chuc ban vui ve',
       duration: 5000
   }
   addToast(document.getElementById('messages'), toast)
   const showToast = () => {
    addToast(document.getElementById('messages'), toast)
   } 
</script>
</body>
</html>