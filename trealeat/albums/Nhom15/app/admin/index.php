<?php 
    require_once('../lib/functions.php');
    $d = initializeApp('streamline');	
    $domain = $_SERVER['HTTP_HOST'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <link href='https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css' rel='stylesheet'>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    
    <?php 
       if ($domain != '127.0.0.1:8000') {
            echo '
            <link rel="stylesheet" href="../assets/css/global_variable.css">
            <link rel="stylesheet" href="../assets/css/common.css">
            <link rel="stylesheet" href="../assets/css/admin.css">
            <link rel="stylesheet" href="../assets/css/grid.css">
            <link rel="stylesheet" href="../assets/css/map.css">
            <link rel="stylesheet" href="../assets/css/settingpage.css">
            <link rel="stylesheet" href="../assets/css/game.css">
            <link rel="stylesheet" href="../assets/js/richtext/richtext.min.css">
            <script type="text/javascript" src="../assets/js/richtext/jquery.richtext.js"></script>
            ';
        } else {
            echo '
            <link rel="stylesheet" href="assets/css/global_variable.css">
            <link rel="stylesheet" href="assets/css/common.css">
            <link rel="stylesheet" href="assets/css/grid.css">
            <link rel="stylesheet" href="assets/css/admin.css">
            <link rel="stylesheet" href="assets/css/map.css">
            <link rel="stylesheet" href="assets/css/settingpage.css">
            <link rel="stylesheet" href="assets/css/game.css">
            <link rel="stylesheet" href="assets/js/richtext/richtext.min.css">
            <script type="text/javascript" src="assets/js/richtext/jquery.richtext.js"></script>
            ';
        }
    ?>
    
    <title>Admin</title>
    <style>
        #toasts {
            width: 350px;
            max-width: 100%;
            position: fixed;
            right: 0;
            top: 1rem;
            z-index: 333;
            height: calc(100vh - 1rem);
            padding: 0.5rem;
            background-color: transparent;
            user-select: none;
            pointer-events: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="sidebar">
            <div class="logo">
                <img src="logo.jpg" alt="logo travel" draggable="false">
            </div>
            <ul id='navs'>
                
            </ul>
        </div>
        <main>
            <div class="page" id="setting-page">
                <h1 style="text-align: center"><?php echo $d['title']?></h1>
                <div id="setting">
                    <div class="row">
                        <div class="col-7 col-md-12">
                            <div class="form-card">
                                <div class="form-card-header">
                                    Nền
                                </div>
                                <div class="form-card-body" >
                                    <div class="grid" id='backgrounds'>

                                    </div>

                                </div>
                            </div> 
                            

                        </div>
                        <div class="col-5 col-md-12">
                            <div class="form-card">
                                <div class="form-card-header">
                                    Thông tin chung của trang
                                </div>
                                <div class="form-card-body">
                                    <div class="textfield">
                                        <input type="text" name="title" 
                                        
                                            id="title" 
                                        />
                                        <label for="number_of_cells">Tiêu đề </label>
                                    </div>

                                </div>
                            </div> 
                            <div class="form-card">
                                <div class="form-card-header">
                                    Lời chào ban đầu
                                </div>
                                <div class="form-card-body">
                                    <div class="textfield">
                                        <input type="text" name="greeting" 
                                            id="greeting"
                                        />
                                        <label for="number_of_cells">Lời chào</label>
                                    </div>

                                </div>
                            </div> 
                            <div class="form-card">
                                <div class="form-card-header">
                                    Kiểm soát một số tính năng
                                </div>
                                <div class="form-card-body">
                                   <div id="features-control">

                                   </div>
                                </div>
                            </div> 
                            
                        </div>
                    </div>
         
                </div>
               
            </div>
            <div class="page" id="locations-page">
                <div id='add-item' class="grid" style='grid-gap: 10px;'>
                
            </div>
    
                <div id="location-content" style="max-width: 1080px; margin: 0 auto;">
                    <div class="page-header">
                        <h2>Các địa điểm</h2>
                        <button onclick='addLocation()' class="btn btn-save">
                            Thêm địa điểm mới
                        </button>
                    </div>
                    
                </div>
                  
            </div>
            <div class="page" id="map">
                <h1 style="text-align: center; font-size: 1.5rem; line-height: 1.5rem;">Thiết kế bản đồ</h1>
                <div class="actions">
                    <div class="left-btn">
                        <div class="">
                        <button class="btn btn-light" id="togglePlotMode">Xây dựng ô đất</button>    
                        </div>
                        <div id="toggleDrawPathMode-wraper">
                            <button class="btn btn-light" id="toggleDrawPathMode" >Xây dựng đường đi</button>
                            <div id="path-choice-list">
                              
                            </div>
                        </div>
                    </div>
                    <div class="right">
                        <div class="container-right">
                            <div class="left-field">
                                <div class="textfield">
                                    <input type="number" name="number_of_cells" onchange="change(this)" placeholder="vd: 5000" class="map-input" id="number_of_cells" />
                                    <label for="number_of_cells">Tổng số ô</label>
                                </div>
                                <div class="textfield">
                                    <input type="number" name="cells_per_row" onchange="change(this)" placeholder="vd: 50" class="map-input" id="cells_per_row" />
                                    <label for="cells_per_row">Số ô trên 1 dòng</label>
                                </div>
                                <div class="textfield">
                                    <input type="text" name="cell_width" onchange="change(this)" placeholder="Ex: 50px" class="map-input" id="cell_width" />
                                    <label for="cell_width">Độ rộng 1 ô</label>
                                </div>
                            </div>
                            <button class="btn btn-save" onclick="refresh()">Làm mới</button>
                        </div>
                    </div>
                </div>

                    <div id="view" class='view'>
                    <?php
                        $col_per_row = $d['map']['cells_per_row'];
                        echo "
                            <div class='board' id='board' style='grid-template-columns: repeat($col_per_row, 1fr);'>
                            </div>
                        ";
                    ?>
                    </div>
            </div>
            <div class="page" id="decorators-page">
                <div id="decorator-content" style="max-width: 1080px; margin: 0 auto;">
                    <div class="page-header">
                        <h2>Các banner</h2>
                        <button onclick='addDecorator()' class="btn btn-save">
                            Thêm banner mới
                        </button>
                    </div>
                    
                </div>
            </div>
            <div class="page" id="game">
            <h1 style="text-align: center">Game</h1>
                <div id="game-setting">
                    <div class="row">
                        <div class="col-7 col-md-12">
                            <div class="form-card">
                                <div class="form-card-header">Mô tả chung về  trò chơi của bạn cho người chơi</div>
                                <div class="form-card-body">
                                    <textarea id="game_description" name="game_description" id="game_description"></textarea>
                                </div>
                            </div>
                            <div class="form-card">
                                <div class="form-card-header">Thiết lập</div>
                                <div class="form-card-body">
                                    <div class="row">
                                        <div class="col-5 col-ms-12 game-params" >
                                            
                                            <div class="section">
                                                <div class="textfield" style="margin-bottom: 1rem;">
                                                    <input type="number" 
                                                        name="max_turn_replies" 
                                                        placeholder="vd: 50" 
                                                        id="max_turn_replies"
                                                            
                                                    />
                                                    <label for="cells_per_row">Số lần trả lời tối đa</label>
                                                </div>
                                                <div class="textfield">
                                                    <input type="text" name="key" placeholder="vd: XINCHAO" id="key" />
                                                    <label for="key">Từ khóa của trò chơi</label>
                                                </div>
                                            </div>
                                            <div class="section">
                                                <div class="section__label">Banner chúc mừng người chiến thắng</div>
                                                <div class="section__body">
                                                   <div class="bg-image select_image_wraper" id="win_banner">
                                                    <div class="select_button_blur ">
                                                        <span onclick="selectImage('win')">Chọn ảnh</span>
                                                    </div>
                                                   </div>      
                                                </div>
                                            </div>
                                            <div class="section">
                                                <div class="section__label">Banner gửi đến người thua cuộc</div>
                                                <div class="section__body">
                                                   <div class="bg-image select_image_wraper" id="loss_banner">
                                                    <div class="select_button_blur ">
                                                        <span onclick="selectImage('loss')">Chọn ảnh</span>
                                                    </div>
                                                   </div>      
                                                </div>
                                            </div>
                                            

                                        </div>
                                          
                                        <div class="col-7 col-ms-12" style = "padding:0;">
                                            <div class="flex space-between" style="margin-bottom: 1rem;">
                                                <div class="section">
                                                    <div class="section__label">Số  hàng</div>
                                                    <div class="section__body">
                                                        <div class="game-param">
                                                            <div  onclick="changeDimention('rows', -1)"><i class='bx bx-minus' ></i></div>
                                                            <span id='rows'></span>
                                                            <div onclick="changeDimention('rows', 1)"><i class='bx bx-plus'></i></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="section" style="margin: 0">
                                                    <div class="section__label">Số  cột</div>
                                                    <div class="section__body">
                                                        <div class="game-param">
                                                            <div onclick="changeDimention('cols', -1)"><i class='bx bx-minus' ></i></div>
                                                            <span id='cols'></span>
                                                            <div onclick="changeDimention('cols', 1)"><i class='bx bx-plus'></i></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="grid_images_wraper">
                                                <div id="grid-images">

                                                </div>
                                                <div class="select_button">
                                                    <span onclick="selectImage('root_image')">Chọn ảnh</span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    
                                </div>
                            </div>

                        </div>
                        <div class="col-5 col-md-12">
                            Questions
                        </div>
                    </div>
         
                </div>
            </div>
        </main>        
    </div>
    <div id="toasts"></div>
    <script>
        let state =  JSON.parse('<?php echo json_encode($d); ?>')
        // handle scroll event 
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
    </script> 
    <?php 
       if ($domain != '127.0.0.1:8000') {
            echo '
            <script src="../assets/js/common.js"></script>
            <script src="../assets/js/admin.js"></script>
            <script src="../assets/js/settingPage.js"></script>
            <script src="../assets/js/locationadmin.js"></script>
            <script src="../assets/js/decoratoradmin.js"></script>
            <script src="../assets/js/gamePage.js"></script>
            ';
        } else {
            echo '
            <script src="assets/js/common.js"></script>
            <script src="assets/js/admin.js"></script>
            <script src="assets/js/settingPage.js"></script>
            <script src="assets/js/locationadmin.js"></script>
            <script src="assets/js/decoratoradmin.js"></script>
            <script src="assets/js/gamePage.js"></script>
            ';
        }
    
    ?>
    

</body>
</html>