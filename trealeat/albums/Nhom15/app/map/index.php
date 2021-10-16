<?php
	require_once('../lib/functions.php');

	$d = initializeApp('streamline');	
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
<style>
	
</style>
<!--Easy Scroll Dots style-->
<style>
</style>
<link href='https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css' rel='stylesheet'>
<link rel="stylesheet" href="assets/css/global_variable.css">
<link rel="stylesheet" href="assets/css/common.css">
<link rel="stylesheet" href="assets/css/canvas_index.css">

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
</head>

<body>
    <div class="container" id="container">
        <div class="view" id="view">
            <div class="board" id="board">
            <?php
                
                $index = 0;
                $cell_w = $d['map']['cell_width'];
                $style = "width: $cell_w; height: $cell_w;"; 
                for($i = 0; $i < $d['map']['number_of_cells']; $i++) {
                    $content = $i;    
                    echo "
                    <div class='brick' style='$style'>
                       
                    </div>
                    ";
                }
            ?>
        
            </div>
        </div>
    </div>
<script>
    const data = JSON.parse('<?php echo json_encode($d); ?>')
</script>
<script src="assets/js/index.js"></script>
<script src="assets/js/common.js"></script>
<script src="assets/js/map_index.js"></script>
<script>
            document.addEventListener('DOMContentLoaded', function () {
                const ele = document.getElementById('board');
                ele.style.cursor = 'grab';

                let pos = { top: 0, left: 0, x: 0, y: 0 };

                const mouseDownHandler = function (e) {
                    ele.style.cursor = 'grabbing';
                    ele.style.userSelect = 'none';

                    pos = {
                        left: ele.scrollLeft,
                        top: ele.scrollTop,
                        // Get the current mouse position
                        x: e.clientX,
                        y: e.clientY,
                    };

                    document.addEventListener('mousemove', mouseMoveHandler);
                    document.addEventListener('mouseup', mouseUpHandler);
                };

                const mouseMoveHandler = function (e) {
                    // How far the mouse has been moved
                    const dx = e.clientX - pos.x;
                    const dy = e.clientY - pos.y;

                    // Scroll the element
                    ele.scrollTop = pos.top - dy;
                    ele.scrollLeft = pos.left - dx;
                };

                const mouseUpHandler = function () {
                    ele.style.cursor = 'grab';
                    ele.style.removeProperty('user-select');

                    document.removeEventListener('mousemove', mouseMoveHandler);
                    document.removeEventListener('mouseup', mouseUpHandler);
                };

                // Attach the handler
                ele.addEventListener('mousedown', mouseDownHandler);
            });
    </script>
</body>
</html>