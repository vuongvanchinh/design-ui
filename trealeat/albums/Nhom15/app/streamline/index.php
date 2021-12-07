

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
<link rel="stylesheet" href="assets/css/global_variable.css">
<!-- <link rel="stylesheet" href="assets/css/index.css"> -->
<link href='https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css' rel='stylesheet'>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<!-- 1. jQuery UI -->

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
       z-index: 34;
   }
   #bubble-chat-warper {
       background-color: transparent;
       position: fixed;
       top: 0;
       left: 0;
       height: 100vh;
       width: 100vw;

   }
   #bubble-chat {
        width: 60px;
        height: 60px;
        /* background-color: red; */
        /* border: 2px solid var(--main-color); */
        position: absolute;
        top: 10px;
        left: 20px;
        border-radius: 50%;
        box-shadow: #000000b8 0px 0px 12px
        
    }
</style>
<body >
    <div id="bubble-chat-warper">
        <div id="bubble-chat">

        </div>
    </div>
</div>
<script src="assets/js/common.js"></script>
</script>

<script>
  $(document).ready(() => {
        const ele = document.getElementById('bubble-chat');
        const screen_w = $('#bubble-chat-warper').width()
        const screen_h = $('#bubble-chat-warper').height()
        const ele_w = $(ele).width()
        ele.style.cursor = 'grab';
        ele.style.left = "0px"
        ele.style.top = "20px"    
        let pos = { top: 0, left: 0, x: 0, y: 0 };
        const touchDownHandle = (e) => {
            ele.style.cursor = 'grabbing';
            ele.style.userSelect = 'none';

            pos = {
                left: parseInt(ele.style.left),
                top: parseInt(ele.style.top),
                // Get the current mouse position
                x: e.changedTouches[0].clientX,
                y: e.changedTouches[0].clientY,
            };

            console.log( "left-top", ele.style.top, ele.style.left)
            console.log("🚀 ~ file: index.php ~ line 72 ~ mouseDownHandler ~ pos", pos)
            
            document.addEventListener('touchmove', touchMoveHandle);
            document.addEventListener('touchend', touchUpHandle);
        }
        const touchMoveHandle = (e) => {
        
            // How far the mouse has been moved
            const dx = e.changedTouches[0].clientX - pos.x;
            const dy = e.changedTouches[0].clientY - pos.y;
            let top = pos.top + dy
            // console.log("top", top)
            if (top < 0) {
                top = 0
            } else if (top > screen_h - ele_w) {
                top = screen_h - ele_w
            }
            let left = pos.left + dx
            // console.log("left", left)
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
            }else {
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
            const mouseDownHandler = function (e) {
                ele.style.cursor = 'grabbing';
                ele.style.userSelect = 'none';

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

            const mouseMoveHandler = function (e) {
                
                // How far the mouse has been moved
                const dx = e.clientX - pos.x;
                const dy = e.clientY - pos.y;
                // console.log("dy", dy, "pos.top", pos.top)
                // Scroll the element
                const screen_w = $('#bubble-chat-warper').width()
                const screen_h = $('#bubble-chat-warper').height()

                let top = pos.top + dy
                // console.log("top", top)
                if (top < 0) {
                    top = 0
                } else if (top > screen_h - ele_w) {
                    top = screen_h - ele_w
                }
                let left = pos.left + dx
                // console.log("left", left)
                if (left < 0) {
                    left = 0
                } else if (left > screen_w - ele_w) {
                    left = screen_w - ele_w
                }
                ele.style.top = `${top}px`;
                ele.style.left = `${left}px`;
            };

            const mouseUpHandler = function () {
                ele.style.cursor = 'grab';
                ele.style.removeProperty('user-select');
                const screen_w = $('#bubble-chat-warper').width()
                
                if (parseInt(ele.style.left) < screen_w / 2) {
                    $(ele).animate({
                        left: 0
                    })
                }else {
                    $(ele).animate({
                        left: screen_w - $(ele).width()
                    })
                }
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            };
            ele.addEventListener('mousedown', mouseDownHandler);
            if (window.location.host === '127.0.0.1:8000') {// for test, develop 
                ele.addEventListener('touchstart', touchDownHandle);
            }
        }
  })
</script>
</body>
</html>