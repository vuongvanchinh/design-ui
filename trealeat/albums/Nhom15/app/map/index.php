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

        #messages {
            width: 350px;
            max-width: 100%;

            position: fixed;
            right: 0;
            top: 1rem;
            z-index: 33;
            overflow: hidden;
            height: 100vh;
            padding: 0.5rem;
            z-index: 34;
        }
    </style>
    <!--Easy Scroll Dots style-->
    <style>
    </style>
    <link href='https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css' rel='stylesheet'>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <?php

    if ($domain == '127.0.0.1:8000') {
        echo '
        <link rel="stylesheet" href="assets/css/global_variable.css">
        <link rel="stylesheet" href="assets/css/common.css">
        <link rel="stylesheet" href="assets/css/canvas_index.css">  
        <link rel="stylesheet" href="assets/css/grid.css">        
        <link rel="stylesheet" href="assets/css/questions.client.css">        
    ';
    } else {
        echo '
        <link rel="stylesheet" href="../assets/css/global_variable.css">
        <link rel="stylesheet" href="../assets/css/common.css">
        <link rel="stylesheet" href="../assets/css/canvas_index.css">
        <link rel="stylesheet" href="../assets/css/grid.css">        
        <link rel="stylesheet" href="../assets/css/questions.client.css">        
        
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

            <div class="board bg-image" id='board'>
            </div>
            <p id="message"></p>
        </div>

        <div id="toasts">

        </div>
        <div id="bubble-chat">
            <!-- <div class="popup">
                <div class="popuptext" id="myPopup">
                </div>
            </div> -->
        </div>
        <div id="myModal" class="modalGame">
            <!-- Modal content -->
            <div class="modalGame-content">
                <span class="close">&times;</span>
                <div>
                    <span class="guide">?</span>
                    <span class="guide-popup" id="guide-popup">
                        <h2>Hướng dẫn</h2>
                        <hr color="black">
                        <span style="text-align: left">
                            <br>
                            - Mỗi địa điểm sẽ có một câu hỏi là một mảnh ghép của bức tranh phía dưới.
                            <br> - Bạn cần trả lời đúng câu hỏi ở các địa điểm để có thể xem được một phần của bức tranh.
                            <br> - Nhập từ khóa liên quan đến hình ảnh mà bạn mở ra ở dưới. Bạn sẽ có 5 lần trả lời.
                        </span>
                    </span>
                </div>
                <div id="gamePopup"></div>
            </div>

        </div>

    </div>

    <?php

    if ($domain == '127.0.0.1:8000') {
        echo '
            <script src="assets/js/common.js"></script>
            <script src="assets/js/index.js"></script>
            <script src="assets/js/map_index.js"></script>     
            <script src="assets/js/game.js"></script>     
        ';
    } else {
        echo '
            <script src="../assets/js/common.js"></script>
            <script src="../assets/js/map_index.js"></script>
            <script src="../assets/js/index.js"></script>
            <script src="../assets/js/game.js"></script>
        ';
    }
    ?>
    <script>
        $(document).ready(() => {
            // Check Gamefeature

            let count = 0;
            const ele = document.getElementById('bubble-chat');
            const screen_w = $("#container").width()
            const screen_h = $("#container").height()
            const ele_w = $(ele).width()
            ele.style.cursor = 'grab';
            ele.style.left = "0px"
            ele.style.top = "20px"
            let pos = {
                top: 0,
                left: 0,
                x: 0,
                y: 0
            };
            var rect;
            // if(1==1) {
            //     ele.style.display = "none";
            //     modal.style.display = "none";
            // }
            //MODEL
            // Get the modal
            let modal = document.getElementById("myModal");
            let myGamePopup = document.getElementById("gamePopup");
            // Get the <span> element that closes the modal
            let span_close = document.getElementsByClassName("close")[0];
            let span_guide = document.getElementsByClassName("guide")[0];

            // When the user clicks the button, open the modal 
            ele.onclick = function() {
                myGamePopup.innerHTML = `${gamePopup()}`;
               
                if (modal.style.display == "none") {
                    ele.style.top = "1px";
                    rect = ele.getBoundingClientRect();
                    // console.log(rect.left);
                    if (rect.left == 0) {
                        modal.classList.remove("modalGame-right");
                        modal.classList.add("modalGame-left");
                        modal.style.display = "block";
                    } else {
                        modal.classList.remove("modalGame-left");
                        modal.classList.add("modalGame-right");
                        modal.style.display = "block";
                    }
                } else {
                    modal.style.display = "none";
                }
                checkEnter();
            }

            span_guide.onclick = function() {
                document.getElementById("guide-popup").classList.toggle("show-guidePopup");
            }

            // When the user clicks on <span> (x), close the modal
            span_close.onclick = function() {
                modal.style.display = "none";
            }
            //

            // function myFunction() {


            // if (count == 0) {
            //     rect = ele.getBoundingClientRect();
            //     var popup = document.getElementById("myPopup");
            //     rect.left == 0;
            //     popup.innerHTML = `${gamePopup()}`;
            //     if (popup.style.display == "block") {
            //             popup.style.display = "none"
            //         } else
            //             popup.style.display = "block"
            //         popup.style.left = "100%";
            //         popup.style.top = "100%";
            //         popup.style.right = "none";
            //         // if (rect.left == 0) {
            //         //     popup.innerHTML = `${gamePopup()}`;
            //         //     popup.classList.toggle("show-left");
            //         //     popup.style.left = "50%";
            //         //     popup.style.top = "100%";
            //         //     popup.style.right = "none";
            //         // } else {
            //         //     popup.innerHTML = `${gamePopup()}`;
            //         //     popup.classList.toggle("show-right");
            //         //     popup.style.right = "15px";
            //         //     popup.style.left = "none";
            //         // }
            //     }
            // }

            // ele.onclick = myFunction;


            const touchDownHandle = (e) => {

                ele.style.cursor = 'grabbing';
                ele.style.userSelect = 'none';

                pos = {
                    left: parseInt(ele.style.left),
                    top: parseInt(ele.style.top),
                    x: e.changedTouches[0].clientX,
                    y: e.changedTouches[0].clientY,
                };

                document.addEventListener('touchmove', touchMoveHandle);
                document.addEventListener('touchend', touchUpHandle);
            }
            const touchMoveHandle = (e) => {
                e.preventDefault()
                // How far the mouse has been moved
                const dx = e.changedTouches[0].clientX - pos.x;
                const dy = e.changedTouches[0].clientY - pos.y;
                let top = pos.top + dy
                if (top < 0) {
                    top = 0
                } else if (top > screen_h - ele_w) {
                    top = screen_h - ele_w
                }
                let left = pos.left + dx
                if (left < 0) {
                    left = 0
                } else if (left > screen_w - ele_w) {
                    left = screen_w - ele_w
                }
                ele.style.top = `${top}px`;
                ele.style.left = `${left}px`;
            }
            const touchUpHandle = (e) => {
                ele.style.cursor = 'grab';
                ele.style.removeProperty('user-select');

                if (parseInt(ele.style.left) < screen_w / 2) {
                    $(ele).animate({
                        left: 0
                    })
                } else {
                    $(ele).animate({
                        left: screen_w - $(ele).width()
                    })
                }
                document.removeEventListener('touchmove', touchMoveHandle);
                document.removeEventListener('touchend', touchUpHandle);
            }
            if (navigator.userAgentData.mobile) {
                ele.addEventListener('touchstart', touchDownHandle);
            } else {
                const mouseDownHandler = function(e) {
                    ele.style.cursor = 'grabbing';
                    ele.style.userSelect = 'none';
                    count = 0;
                    pos = {
                        left: parseInt(ele.style.left),
                        top: parseInt(ele.style.top),
                        // Get the current mouse position
                        x: e.clientX,
                        y: e.clientY,
                    };


                    document.addEventListener('mousemove', mouseMoveHandler);

                    document.addEventListener('mouseup', mouseUpHandler);

                };

                const mouseMoveHandler = function(e) {
                    count++;
                    // How far the mouse has been moved
                    const dx = e.clientX - pos.x;
                    const dy = e.clientY - pos.y;
                    // Scroll the element
                    const screen_w = $("#container").width()
                    const screen_h = $("#container").height()

                    let top = pos.top + dy
                    if (top < 0) {
                        top = 0
                    } else if (top > screen_h - ele_w) {
                        top = screen_h - ele_w
                    }
                    let left = pos.left + dx
                    if (left < 0) {
                        left = 0
                    } else if (left > screen_w - ele_w) {
                        left = screen_w - ele_w
                    }
                    ele.style.top = `${top}px`;
                    ele.style.left = `${left}px`;
                };

                const mouseUpHandler = function() {
                    ele.style.cursor = 'grab';
                    ele.style.removeProperty('user-select');
                    const screen_w = $("#container").width()

                    if (parseInt(ele.style.left) < screen_w / 2) {
                        $(ele).animate({
                            left: 0
                        })
                    } else {
                        $(ele).animate({
                            left: screen_w - $(ele).width()
                        })
                    }
                    document.removeEventListener('mousemove', mouseMoveHandler);
                    document.removeEventListener('mouseup', mouseUpHandler);
                };
                ele.addEventListener('mousedown', mouseDownHandler);
                if (window.location.host === '127.0.0.1:8000') { // for test, develop 
                }
            }
        });

        function movePage() {
            const ele = document.getElementById('view');
            ele.style.cursor = 'grab';

            let pos = {
                top: 0,
                left: 0,
                x: 0,
                y: 0
            };

            const mouseDownHandler = function(e) {
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

            const mouseMoveHandler = function(e) {
                // How far the mouse has been moved
                const dx = e.clientX - pos.x;
                const dy = e.clientY - pos.y;

                // Scroll the element
                ele.scrollTop = pos.top - dy;
                ele.scrollLeft = pos.left - dx;
            };

            const mouseUpHandler = function() {
                ele.style.cursor = 'grab';
                ele.style.removeProperty('user-select');

                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            };

            // Attach the handler
            ele.addEventListener('mousedown', mouseDownHandler);
        }

        document.addEventListener('DOMContentLoaded', movePage);
    </script>
</body>

</html>