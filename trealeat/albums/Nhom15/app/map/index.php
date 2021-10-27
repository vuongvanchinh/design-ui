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
<link rel="stylesheet" href="../assets/css/global_variable.css">
<link rel="stylesheet" href="../assets/css/common.css">
<link rel="stylesheet" href="../assets/css/canvas_index.css">


<link rel="stylesheet" href="assets/css/global_variable.css">
<link rel="stylesheet" href="assets/css/common.css">
<link rel="stylesheet" href="assets/css/canvas_index.css">

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
</head>

<body>
    <div class="container" id="container">
        <div class="view" id="view">
            <div class="dashed-loader-wraper" id='pre-loader'>
                <div class="dashed-loading dashed-loading-medium"></div>
            </div>   
            <div class="board" id='board'></div>
        </div>
    </div>
    <input type="hidden" id="data_is_set" value='0' style='display:none;'>
<script src="../assets/js/common.js"></script>
<script src="assets/js/common.js"></script>
<script>
    
    let data = {}
    let loader = null
    $(document).ready(() => {
        loader = loading('loader-page')
        $(`#container`).append(loader.getHtml())
       
        ;(async () => {
            try {
                // let res = await JSON.parse('{"map":{"cell_width":"50px","cells_per_row":50,"number_of_cells":"3400","plots":[{"index":142,"x":23,"y":6,"w":3,"h":3,"item_id":"location_1"},{"index":457,"x":24,"y":13,"w":5,"h":5,"item_id":"location_2"},{"index":492,"x":9,"y":14,"w":4,"h":4,"item_id":"location_3"},{"index":815,"x":24,"y":21,"w":5,"h":5,"item_id":"location_5"},{"index":804,"x":9,"y":22,"w":4,"h":4,"item_id":"location_6"},{"index":1176,"x":24,"y":29,"w":5,"h":5,"item_id":"location_8"},{"index":773,"x":40,"y":20,"w":4,"h":4,"item_id":"location_9"},{"index":967,"x":34,"y":25,"w":4,"h":4,"item_id":"location_10"},{"index":1510,"x":24,"y":37,"w":5,"h":5,"item_id":"location_11"},{"index":2086,"x":24,"y":50,"w":5,"h":5,"item_id":"location_12"},{"index":1887,"x":25,"y":45,"w":3,"h":3,"item_id":"location_13"},{"index":1885,"x":41,"y":47,"w":3,"h":3,"item_id":"location_14"},{"index":1887,"x":25,"y":44,"w":3,"h":3,"item_id":"location_15"},{"index":1376,"x":40,"y":34,"w":4,"h":4,"item_id":"location_16"},{"index":2118,"x":41,"y":53,"w":3,"h":3,"item_id":"location_17"},{"index":1484,"x":9,"y":37,"w":4,"h":4,"item_id":"location_18"},{"index":1841,"x":9,"y":47,"w":3,"h":3,"item_id":"location_19"},{"index":2264,"x":9,"y":54,"w":3,"h":3,"item_id":"location_20"},{"index":2643,"x":25,"y":62,"w":3,"h":3,"item_id":"location_21"},{"index":2477,"x":9,"y":59,"w":3,"h":3,"item_id":"location_22"},{"index":622,"x":15,"y":17,"w":4,"h":4,"item_id":"location_23"},{"index":250,"x":6,"y":6,"w":17,"h":2,"item_id":"location_24"},{"index":172,"x":22,"y":4,"w":2,"h":2,"item_id":"location_25"},{"index":174,"x":25,"y":4,"w":2,"h":2,"item_id":"location_26"},{"index":251,"x":26,"y":6,"w":21,"h":2,"item_id":"location_27"},{"index":306,"x":45,"y":8,"w":2,"h":23,"item_id":"location_28"},{"index":1263,"x":47,"y":30,"w":2,"h":3,"item_id":"location_29"},{"index":1437,"x":47,"y":34,"w":2,"h":3,"item_id":"location_30"},{"index":1517,"x":45,"y":36,"w":2,"h":29,"item_id":"location_31"},{"index":2592,"x":28,"y":63,"w":17,"h":2,"item_id":"location_32"},{"index":2697,"x":27,"y":65,"w":2,"h":2,"item_id":"location_33"},{"index":2694,"x":24,"y":65,"w":2,"h":2,"item_id":"location_34"},{"index":270,"x":6,"y":8,"w":2,"h":23,"item_id":"location_35"},{"index":1414,"x":6,"y":36,"w":2,"h":29,"item_id":"location_35"},{"index":2535,"x":8,"y":63,"w":17,"h":2,"item_id":"location_36"},{"index":1151,"x":4,"y":30,"w":2,"h":3,"item_id":"location_37"},{"index":1318,"x":4,"y":34,"w":2,"h":3,"item_id":"location_38"},{"index":2858,"x":24,"y":71,"w":5,"h":5,"item_id":"location_39"}],"paths":[]},"exec":"streamline","title":"Trealet","locations":[{"id":"location_1","name":"\u0110i\u1ec7n Th\u00e1i H\u00f2a","effect":"loops","description":"\u0110i\u1ec7n Th\u00e1i H\u00f2a (ch\u1eef H\u00e1n: \u592a\u548c\u6bbf) l\u00e0 cung \u0111i\u1ec7n n\u1eb1m trong khu v\u1ef1c \u0110\u1ea1i N\u1ed9i c\u1ee7a kinh th\u00e0nh Hu\u1ebf, l\u00e0 n\u01a1i \u0111\u0103ng quang c\u1ee7a 13 vua tri\u1ec1u Nguy\u1ec5n t\u1eeb Gia Long \u0111\u1ebfn B\u1ea3o \u0110\u1ea1i. Trong ch\u1ebf \u0111\u1ed9 phong ki\u1ebfn cung \u0111i\u1ec7n n\u00e0y \u0111\u01b0\u1ee3c coi l\u00e0 trung t\u00e2m c\u1ee7a \u0111\u1ea5t n\u01b0\u1edbc.X\u00e2y d\u1ef1ng v\u00e0 tr\u00f9ng tu Qu\u00e1 tr\u00ecnh x\u00e2y d\u1ef1ng v\u00e0 tr\u00f9ng tu \u0111i\u1ec7n Th\u00e1i H\u00f2a \u0111\u01b0\u1ee3c chia l\u00e0m 3 th\u1eddi k\u1ef3 ch\u00ednh; m\u1ed7i th\u1eddi k\u1ef3 \u0111\u1ec1u c\u00f3 nh\u1eefng thay \u0111\u1ed5i l\u1edbn, c\u1ea3i ti\u1ebfn v\u1ec1 ki\u1ebfn tr\u00fac v\u00e0 trang tr\u00ed. Vua Gia Long kh\u1edfi c\u00f4ng x\u00e2y d\u1ef1ng v\u00e0o ng\u00e0y 21 th\u00e1ng 2 n\u0103m 1805 v\u00e0 ho\u00e0n th\u00e0nh v\u00e0o th\u00e1ng 10 c\u00f9ng n\u0103m. N\u0103m 1833 khi vua Minh M\u1ea1ng quy ho\u1ea1ch l\u1ea1i h\u1ec7 th\u1ed1ng ki\u1ebfn tr\u00fac cung \u0111\u00ecnh \u1edf \u0110\u1ea1i N\u1ed9i, trong \u0111\u00f3 c\u00f3 vi\u1ec7c cho d\u1eddi \u0111i\u1ec7n v\u1ec1 m\u00e9 nam v\u00e0 l\u00e0m l\u1ea1i \u0111\u1ed3 s\u1ed9 v\u00e0 l\u1ed9ng l\u1eaby h\u01a1n. N\u0103m 1923 d\u01b0\u1edbi th\u1eddi vua Kh\u1ea3i \u0110\u1ecbnh \u0111\u1ec3 chu\u1ea9n b\u1ecb cho l\u1ec5 T\u1ee9 tu\u1ea7n \u0110\u1ea1i kh\u00e1nh ti\u1ebft c\u1ee7a nh\u00e0 vua (m\u1eebng vua tr\u00f2n 40 tu\u1ed5i) di\u1ec5n ra v\u00e0o n\u0103m 1924, \u0111i\u1ec7n Th\u00e1i H\u00f2a \u0111\u00e3 \u0111\u01b0\u1ee3c \u0111\u1ea1i gia tr\u00f9ng ki\u1ebfn. Qua c\u00e1c \u0111\u1ee3t tr\u00f9ng tu l\u1edbn n\u00f3i tr\u00ean v\u00e0 nhi\u1ec1u l\u1ea7n tr\u00f9ng tu s\u1eeda ch\u1eefa nh\u1ecf kh\u00e1c d\u01b0\u1edbi th\u1eddi vua Th\u00e0nh Th\u00e1i, B\u1ea3o \u0110\u1ea1i v\u00e0 trong th\u1eddi gian g\u1ea7n \u0111\u00e2y (v\u00e0o n\u0103m 1960, 1970, 1981, 1985 v\u00e0 1992) \u0111i\u1ec7n Th\u00e1i H\u00f2a \u0111\u00e3 \u00edt nhi\u1ec1u c\u00f3 thay \u0111\u1ed5i, v\u1ebb c\u1ed5 k\u00ednh ng\u00e0y x\u01b0a \u0111\u00e3 gi\u1ea3m \u0111i m\u1ed9t ph\u1ea7n. Tuy nhi\u00ean, c\u1ed1t c\u00e1ch c\u01a1 b\u1ea3n c\u1ee7a n\u00f3 th\u00ec v\u1eabn c\u00f2n \u0111\u01b0\u1ee3c b\u1ea3o l\u01b0u, nh\u1ea5t l\u00e0 ph\u1ea7n k\u1ebft c\u1ea5u ki\u1ebfn tr\u00fac v\u00e0 trang tr\u00ed m\u1ef9 thu\u1eadt.","media":[{"name":"test","description":"Link youtube","type":"YTB","url":"https:\/\/www.youtube.com\/embed\/"},{"name":"DSCF7020","description":"vghgftyftyftyftydytdtyt","type":"JPG","url":"https:\/\/hcloud.trealet.com\/albums\/Nhom15\/media\/images\/B\u00ean_trong_\u0111i\u1ec7n_Th\u00e1i_H\u00f2a.jpg"},{"name":"\u0110i\u1ec7n_Th\u00e1i_H\u00f2a","description":"vghgftyftyftyftydytdtyt","type":"JPEG","url":"https:\/\/hcloud.trealet.com\/albums\/Nhom15\/media\/images\/\u0110i\u1ec7n_Th\u00e1i_H\u00f2a.jpeg"},{"name":"testgvhgghvghvghvgh","description":"bcgccychvhgchgchgchcghchgvgh","type":"YTB","url":"https:\/\/www.youtube.com\/embed\/hZTehTRzY50"}],"next":"quangninh"},{"id":"location_2","name":"Qu\u1ea3ng ninh","effect":"crazy","description":"description","media":[{"name":"testgvhgghvghvghvgh","description":"bcgccychvhgchgchgchcghchgvgh","type":"YTB","url":"https:\/\/www.youtube.com\/embed\/"}],"next":"hanoi"},{"id":"location_3","name":"H\u00e0 n\u1ed9i","effect":"loops","description":"description","media":[{"name":"testgvhgghvghvghvgh","description":"bcgccychvhgchgchgchcghchgvgh","type":"YTB","url":"https:\/\/www.youtube.com\/embed\/hZTehTRzY50"},{"name":"Ng\u1ecd m\u00f4n ","description":"chgchhgcghcghcghchgchgcgcchgcghcghcghcghchgcghch","type":"IFRAME","url":""}],"next":null}],"decorators":[{"id":"decorator_1","name":"test","media":[]}]}')
                let res = await JSON.parse('<?php echo getFullLinkData($d)?>')
                console.log(res)
                data = res 
                // loader.remove()
                // loader = null
                $('#data_is_set').val('1')

            } catch (error) {
                alert(error)
                console.log(error)
            }
        })()
    }) 
</script>

<script src="../assets/js/index.js"></script>
<script src="../assets/js/map_index.js"></script>

<script src="assets/js/index.js"></script>

<script src="assets/js/map_index.js"></script>
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