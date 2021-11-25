<?php
	
    $domain = $_SERVER['HTTP_HOST'];
    
?>

<!DOCTYPE HTML>
<html>

<head>
<title><?php echo $d['title']; ?></title>
<meta name="viewport" content="width=device-width, initial-scale=1.0"> 
<!--test template style-->
<style>
	#toasts {
        width: 350px;
        max-width: 100%;

        position: fixed;
        right: 0;
        top: 1rem;
        z-index: 3;
        overflow: hidden;
        height: 100vh;
        padding: 0.5rem;
        background-color: transparent;
        user-select: none;
        /* background-color: red; */
        pointer-events: none;
    }
</style>
<!--Easy Scroll Dots style-->
<style>
</style>
<link href='https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css' rel='stylesheet'>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<?php
    
    if ($domain == '127.0.0.1:8000') {
        echo'
            <link rel="stylesheet" href="assets/css/global_variable.css">
            <link rel="stylesheet" href="assets/css/common.css">
            <link rel="stylesheet" href="assets/css/canvas_index.css">  
            <link rel="stylesheet" href="assets/css/grid.css">        
        ';
    } else {
        echo'
            <link rel="stylesheet" href="../assets/css/global_variable.css">
            <link rel="stylesheet" href="../assets/css/common.css">
            <link rel="stylesheet" href="../assets/css/canvas_index.css">
            <link rel="stylesheet" href="../assets/css/grid.css">        
            
        ';
    }
?>


<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
</head>
<body>
    <div class="container" id="container">
        <div class="load-wrapp bg-image" id="pre-loader">
            <div class="load-1">
                
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
            </div>
        </div>
        <div class="view" id="view">
             
            <div class="board bg-image" id='board'></div>
        </div>
        <p id="message"></p>
    </div>

    <div id="toasts">

    </div>
    <?php
    
    if ($domain == '127.0.0.1:8000') {
        echo'
            <script src="assets/js/common.js"></script>
            <script src="assets/js/index.js"></script>
            <script src="assets/js/map_index.js"></script>     
        ';
    } else {
        echo'
            <script src="../assets/js/common.js"></script>
            <script src="../assets/js/map_index.js"></script>
            <script src="../assets/js/index.js"></script>
        ';
    }
?>
    <script>
            document.addEventListener('DOMContentLoaded', function () {
                const ele = document.getElementById('view');
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