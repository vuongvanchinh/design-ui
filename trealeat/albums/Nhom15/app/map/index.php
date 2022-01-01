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
    <script src="assets/js/flower/index.min.js"></script>
    <script src="../assets/js/flower/index.min.js"></script>
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
        <div id="game-mask">
            <div id="game-board">
                <div id="bubble-chat" style="background-size: cover;">
            
               </div>
               <div id="myModal" class="modalGame">
                <!-- Modal content -->
                <div class="modalGame-content">
                    <div>
                        <span class="close">&times;</span>
                        <span class="guide">?</span>
                        <span class="guide-popup" id="guide-popup">
                            <h2>Hướng dẫn</h2>
                            <hr color="black">
                            <span style="text-align: left" id="guide-content">
                            </span>
                        </span>
                        <h1>Trò Chơi</h1>
                        <hr>
                    </div>
                    <div id="gamePopup"></div>
                </div>
            </div>

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
            let count = 0;
            const ele = document.getElementById('bubble-chat');
            const elew = document.getElementById('game-board');
            const screen_w = $("#game-mask").width()
            const screen_h = $("#game-mask").height()
            const ele_w = $(elew).width()
            ele.style.cursor = 'grab';
            elew.style.left = "0px"
            elew.style.top = "20px"

            let pos = {
                top: 0,
                left: 0,
                x: 0,
                y: 0
            };
            var rect;
          
            //MODEL
            // Get the modal
            let modal = document.getElementById("myModal");
            let myGamePopup = document.getElementById("gamePopup");
            modal.style.display = "none"; 
            // Get the <span> element that closes the modal
            let span_close = document.getElementsByClassName("close")[0];
            let span_guide = document.getElementsByClassName("guide")[0];
            let guide_content =document.getElementById("guide-content");

            span_guide.onclick = function() {
                // console.log(document.getElementById("guide-popup"));
                // console.log(guide_content);
                guide_content.innerText = `${showGuide()}`
                document.getElementById("guide-popup").classList.toggle("show-guidePopup");
            }


            // When the user clicks on <span> (x), close the modal
            span_close.onclick = function() {
                modal.style.display = "none";
            }

            const touchDownHandle = (e) => {

                ele.style.cursor = 'grabbing';
                ele.style.userSelect = 'none';

                pos = {
                    left: parseInt(elew.style.left),
                    top: parseInt(elew.style.top),
                    x: e.changedTouches[0].clientX,
                    y: e.changedTouches[0].clientY,
                };

                document.addEventListener('touchmove', touchMoveHandle);
                document.addEventListener('touchend', touchUpHandle);
            }

            const touchMoveHandle = (e) => {
                e.preventDefault()
                count++;
                if (modal.style.display !== "none") {
                    
                    return
                }
                // How far the mouse has been moved
                const dx = e.changedTouches[0].clientX - pos.x;
                const dy = e.changedTouches[0].clientY - pos.y;
                // Scroll the element
                const screen_w = $("#game-mask").width()
                const screen_h = $("#game-mask").height()

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
                elew.style.top = `${top}px`;
                elew.style.left = `${left}px`;
            }
            const touchUpHandle = (e) => {
                ele.style.cursor = 'grab';
                ele.style.removeProperty('user-select');

                 // How far the mouse has been moved
                const dx = e.changedTouches[0].clientX - pos.x;
                const dy = e.changedTouches[0].clientY - pos.y;
                
                if (dx < 60 && dy < 60) { // click
                    myGamePopup.innerHTML = `${gamePopup()}`;
                    const screen_w = $("#game-mask").width()
                    if (modal.style.display === "none") {
                        let time = (parseInt(elew.style.top) -  1) *  0.5;
                                                    
                        $( elew ).animate({
                            top: "1px"
                        }, time, function() {
                            // Animation complete.
                            modal.style.display = "block";  
                            if (parseInt(elew.style.left) <= screen_w/2) {
                                modal.classList.remove("modalGame-right");
                                modal.classList.add("modalGame-left");
                                
                            } else {
                                modal.classList.remove("modalGame-left");
                                modal.classList.add("modalGame-right");
                                
                            }
                        })
                        rect = ele.getBoundingClientRect();
                        // console.log(rect.left);
                        
                    } else {
                        myGamePopup.innerHTML
                        modal.style.display = "none";
                        modal.classList.remove("modalGame-left")
                        modal.classList.remove("modalGame-right")

                    }
                    checkEnter();
                }
                const screen_w = $("#game-mask").width()
                console.log(pos)

                
                if (parseInt(elew.style.left) < screen_w / 2) {
                    // alert('1')
                    $(elew).animate({
                        left: 0
                    })
                } else {
                    // alert('2')
                    $(elew).animate({
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
                        left: parseInt(elew.style.left),
                        top: parseInt(elew.style.top),
                        // Get the current mouse position
                        x: e.clientX,
                        y: e.clientY,
                    };


                    document.addEventListener('mousemove', mouseMoveHandler);

                    document.addEventListener('mouseup', mouseUpHandler);

                };

                const mouseMoveHandler = function(e) {
                    count++;
                    if (modal.style.display !== "none") { 
                        return
                    }
                    // How far the mouse has been moved
                    const dx = e.clientX - pos.x;
                    const dy = e.clientY - pos.y;

                    // Scroll the element
                    const screen_w = $("#game-mask").width()
                    const screen_h = $("#game-mask").height()

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
                    elew.style.top = `${top}px`;
                    elew.style.left = `${left}px`;
                    // console.log(elew.style.top, elew.style.left)
                };

                const mouseUpHandler = function(e) {
                    ele.style.cursor = 'grab';
                    ele.style.removeProperty('user-select');
                   
                    // How far the mouse has been moved
                    const dx = Math.abs(e.clientX - pos.x)
                    const dy = Math.abs(e.clientY - pos.y);
                    
                    if (dx < 60 && dy < 60) { // click
                        myGamePopup.innerHTML = `${gamePopup()}`;
                        const screen_w = $("#game-mask").width()
                        if (modal.style.display === "none") {
                            let time = (parseInt(elew.style.top) -  1) *  0.5;
                                                      
                            $( elew ).animate({
                               top: "1px"
                            }, time, function() {
                                // Animation complete.
                                modal.style.display = "block";  
                                if (rect.left <= screen_w/2) {
                                    modal.classList.remove("modalGame-right");
                                    modal.classList.add("modalGame-left");
                                    
                                } else {
                                    modal.classList.remove("modalGame-left");
                                    modal.classList.add("modalGame-right");
                                   
                                }
                            })
                            rect = ele.getBoundingClientRect();
                            // console.log(rect.left);
                            
                        } else {
                            myGamePopup.innerHTML
                            modal.style.display = "none";
                            modal.classList.remove("modalGame-left")
                            modal.classList.remove("modalGame-right")

                        }
                        checkEnter();
                    }
                    const screen_w = $("#game-mask").width()
                    console.log(pos)

                    
                    if (parseInt(elew.style.left) < screen_w / 2) {
                        // alert('1')
                        $(elew).animate({
                            left: 0
                        })
                    } else {
                        // alert('2')
                        $(elew).animate({
                            left: screen_w - $(ele).width()
                        })
                    }
                    document.removeEventListener('mousemove', mouseMoveHandler);
                    document.removeEventListener('mouseup', mouseUpHandler);
                };
                ele.addEventListener('mousedown', mouseDownHandler);
                if (window.location.host === '127.0.0.1:8000') { // for test, develop 
                    ele.addEventListener('touchstart', touchDownHandle);
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