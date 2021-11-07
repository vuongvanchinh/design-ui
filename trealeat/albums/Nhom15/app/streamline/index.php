<?php
	require_once('../lib/functions.php');

	$d = initializeApp('streamline');	
	$ni = sizeof($d['items']);
	$iu = array($ni);	

	for($i=0;$i<$ni;$i++){
		$itemid = $d['items'][$i];
		$idata 	= fetchItemData($itemid);
	}
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
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
</head>
<style>
    .brick {
        --w: 100px;
        width: var(--w);
        height: var(--w);
        border: 1px solid #000;

    }
    
    #board {
        width: fit-content;
        display: grid;
        place-items: center;
        grid-template-columns: repeat(20, 1fr);
        gap: 0;
        width: 500px;
        /* zoom: 0.5; */
        margin: 0 auto;
        position: relative;
        border: 1px solid red;
        overflow: auto;
    }
    .bg-red {
        background-color: red;
    }
</style>
<body >
<div style='background: green'>
    <p id="rs">
    </p>
    <button id='btni'>zoom +</button>
    <button id='btnd'>zoom -</button>
	<div id="board" class="board">
        <div class="brick">1</div>
        <div class="brick">2</div>
        <div class="brick">3</div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
        <div class="brick"></div>
    </div>
    <input type="number" name="" id="test">
</div>
</script>
<!-- <script src="assets/js/index.js"></script> -->
<script>
    let zoom_rate = 1;
    $(document).ready(() => {
        $('#test').change(() => {
            let curent =  $('#test').val()
            $('#test').val(parseInt( $('#test').val()) + 1)
        })
        $('.brick').click((e) => {
            console.log(e.target)
            $(e.target).toggleClass('bg-red');
            let p = $(e.target).position()
            let zero = $('.brick:nth-child(1)').position()
            console.log($('#board').css('gap'))
            $('#rs').html(`zleft ${zero.left} ztop: ${zero.top} p left: ${p.left} p top ${p.top} relative: left ${Math.floor(p.left) - Math.floor(zero.left)} 
            top ${Math.floor(p.top) - Math.floor(zero.top)}`)
        }) 

        $('#btni').click((e) => {
            zoom_rate = zoom_rate + 0.1;
            $('.brick').css('zoom', zoom_rate)            
        })
        $('#btnd').click((e) => {
            zoom_rate = zoom_rate - 0.1;
            $('.brick').css('zoom', zoom_rate)            
        })


        let a = [
            {
                "type": "gradient",
                "style": "background-color: #485461; background-image: linear-gradient(315deg, #485461 0%, #28313b 74%);"
            },
            {
                "type": "gradient",
                "style": "background-color: #000000; background-image: linear-gradient(147deg, #000000 0%, #2c3e50 74%);"
            },
            {
                "type": "gradient",
                "style": "background-color: #2b4162; background-image: linear-gradient(315deg, #2b4162 0%, #12100e 74%);"
            },
            {
                "type": "gradient",
                "style": "background-color: #0d0a0b; background-image: linear-gradient(315deg, #0d0a0b 0%, #009fc2 74%);"
            },
            {
                "type": "gradient",
                "style": "background-color #000000; background-image linear-gradient(315deg, #000000 0%, #7f8c8d 74%);"
            },
            {
                "type": "image",
                "style": "https://huecity.gov.vn/Portals/0/Medias/Nam2021/T7/mo%20rong%20Hue%20(6).jpg"
            }
        ]

        console.log(a[1].style)



    })        
</script>
</body>
</html>