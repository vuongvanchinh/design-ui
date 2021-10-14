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
<link rel="stylesheet" href="assets/css/common.css">
<link rel="stylesheet" href="assets/css/canvas_index.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
</head>

<body>
<div class="container">
    <div class="view">
        <div class="board" id="board">
        <?php
            $locations = array(201, 1365, 219, 1700, 492);
            $index = 0;
            $l = count($d['locations']);
            for($i = 0; $i < 5000; $i++) {
                $content = '';
                // $s = array_search($i, $locations);
                if($index < $l && $i == 201 || $i==219 || $i == 1365) {
                    $content = location($d['locations'][$index]);
                    $index += 1;
                } else {
                    $content=$i;
                }
    
                echo "
                <div class='brick' onclick='onPath($i)'>
                    $content
                </div>
                ";
            }
        ?>
    
        </div>
    </div>
</div>
</script>
<script src="assets/js/index.js"></script>
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