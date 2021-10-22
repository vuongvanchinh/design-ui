<?php 
    require_once('../lib/functions.php');
    $d = initializeApp('streamline');	
    $username = 'Nhom15';
    $password = '12113133';

    $navs = json_decode('[
        {"icon": "bx bx-map", "name": "Locations", "page": "locations"},
        {"icon": "bx bxs-dashboard", "name": "Map", "page": "map"},
        {"icon": "bx bx-dialpad-alt", "name": "Decorators", "page": "decorators"}
    ]');
    if(!$navs) die('Cannot parse the navs content!');	
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../assets/css/admin.css">
    <link rel="stylesheet" href="../assets/css/common.css">
    <link rel="stylesheet" href="../assets/css/global_variable.css">
    
    <link rel="stylesheet" href="assets/css/admin.css">
    <link rel="stylesheet" href="assets/css/common.css">
    <link rel="stylesheet" href="assets/css/global_variable.css">
    
    <link href='https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css' rel='stylesheet'>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <title>Admin</title>
</head>
<body>
    <div class="container">
        <div class="sidebar">
            <div class="logo">
                <img src="logo.jpg" alt="logo travel" draggable="false">
            </div>
            <ul>
                <?php
                    $l = count($navs);

                    for($i = 0; $i < $l; $i++) {
                        $icon = $navs[$i]->icon;
                        $name = $navs[$i]->name;
                        $page = $navs[$i]->page;
                        $active = $i == 0? 'nav-active':'';
                        echo "<li>
                                <div class='nav-item $active' name='$page' onclick='changePage(this)'>
                                    <i class='$icon' ></i>
                                    <span>$name</span>
                                </div>
                             </li>
                        ";
                    }
                ?>
                <li>
                    <div class="nav-item" onclick="saveMap()">
                        <i class='bx bxs-save'></i>    
                        <span>Save</span>
                    </div>
                </li>
            </ul>
        </div>
        <main>
            <div class="page" id="locations">
                    Locations
            </div>
            <div class="page" id="map">
                <h1 style="text-align: center">Build your map</h1>
                <div class="actions">
                    <div class="left">
                        <div class="textfield">
                            <input type="number" name="number_of_cells" 
                                onchange="change(this)" placeholder="vd: 5000" 
                                class="map-input"
                                id="number_of_cells" 
                            />
                            <label for="number_of_cells">Number of cells</label>
                        </div>
                        <div class="textfield">
                            <input type="number" name="cells_per_row" 
                                onchange="change(this)" placeholder="vd: 50" 
                                class="map-input"
                                id="cells_per_row" 
                            />
                            <label for="cells_per_row">Cells per row</label>
                        </div>
                        <div class="textfield">
                            <input type="text" name="cell_width" 
                                onchange="change(this)" placeholder="Ex: 50px" 
                                class="map-input"
                                id="cell_width"
                            />
                            <label for="cell_width">Cell width</label>
                        </div>
                    </div>
                    <div class="right">
                        <button class="btn btn-light btn-active" id="toggleDrawPathMode">Draw path mode</button>
                        <button class="btn btn-light" id="togglePlotMode">Plots of land mode</button>
                        <button class="btn btn-light" onclick="saveMap()">Cancel</button>
                        <button class="btn btn-save" onclick="refresh()">Temper build</button>
                        
                    </div>
                </div>
                    <div id="view">
                        <?php
                        $col_per_row = $d['map']['cells_per_row'];
                        echo "
                            <div class='board' id='board' style='grid-template-columns: repeat($col_per_row, 1fr);'>

                            </div>
                        ";
                    ?>
                    </div>
            </div>
            <div class="page" id="decorators">
                    Decorations
                    cdtydtydd
                    vygygg
                    <br>
                    gtyfyuffuy
            </div>
        </main>        
    </div>
    
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
    <script src="../assets/js/admin.js"></script>
    <script src="assets/js/admin.js"></script>

</body>
</html>