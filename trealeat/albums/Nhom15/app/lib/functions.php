<?php

const APP_URL = 'trealet';

function initializeApp($exec){
	$app_url = '../streamline-example.trealet';
	$json_string = file_get_contents($app_url);	
	if(!$json_string) die($app_url.' not found!');
	$d = json_decode($json_string, true);	
	if(!$d) die('Cannot parse the trealet content!');	
	if(!isset($d['trealet'])) die('It is not a trealet!');	
	if($d['trealet']['exec']!=$exec) die('Wrong executable name!');
	return $d['trealet'];
}

function fetchItemData($item_url){
	$item_url = 'http://trealet.com/tiny'.$item_url.'/?json';
	$json_string = file_get_contents($item_url);
	if(!$json_string) return;	
	$d = json_decode($json_string, true);
	return $d['image'];
}

function htmlItem($idata, $css_id=''){
	$title 	  = $idata['title'];
	$desc	  = $idata['desc'];
	$url_full = $idata['url_full'];
	$path     = $idata['path'];
	$vobj	  = '';
	
	//Supported format APP, FLA, FLV, GIF, GLB, HTM, HTML, JPEG, JPG, M4A, M4V, MP3, MP4, PDF, PNG, PPS, PPT, TIF, TIFF, TXT		
	
	$ext = strtoupper(pathinfo($url_full, PATHINFO_EXTENSION));
	
	//items
	if($ext=='GIF' || $ext=='JPEG'|| $ext=='JPG'|| $ext=='PNG'|| $ext=='TIF'|| $ext=='TIFF'){
		$vobj .= '<center><img src="'.$url_full.'" style="max-width:90%;"></center>';
	}
	
	//Text
	if($ext=='TXT'){
		$vobj .= file_get_contents('http://trealet.com'.$url_full); //For embedded video
		//$vobj = '<iframe src="'.$url_full.'"></iframe>';
	}
	
	//Youtube
	if($ext=="YTB"){
		$vid = file_get_contents('http://trealet.com'.$url_full);
		$vobj .= '<div style="position: relative; width: 90%; height: 0; padding-bottom: 50%;">';
		$vobj .= '<iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/'.$vid.'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
		$vobj .= '</div>';
	}
	
	//GLB for 3D
	if($ext=='GLB'){
		$vobj .= '<div style="position: relative; width: 90%; height: 0; padding-bottom: 50%;">';
		$vobj .= '<iframe src="http://trealet.com/h3r/embed/?glb='.$url_full.'" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>';
		$vobj .= '</div>';
		$vobj = '<center>'.$vobj.'</center>';
	}
	
	//Audio MP3
	if($ext=='MP3'){
		$vobj = '<audio controls><source src="'.$url_full.'" type="audio/mpeg">Your browser does not support the audio tag.</audio>';
	}
	
	//Video MP4
	if($ext=='MP4'){
		$vobj = '<video width="90%" height="auto" controls><source src="'.$url_full.'" type="video/mp4">Your browser does not support the video tag.</video>';
	}
	
	$html = '<div id="'.$css_id.'"><h1>'.$title.'</h1><center>'.$vobj.'</center><br><p>'.$desc.'</p></div>';
	return $html;
}

function location($data) {
	$style = 'style="left:'.$data['position']['x'].'; top:'.$data['position']['y'].';"';
	$images = '';
	$l = count($data['images']);

	for($i = 0; $i < 6 && $i < $l; $i++) {
		$images = $images.'<img src="'.$data['images'][$i].'" draggable="false" >';
	}

	$html = '
		<div>
			<div class="cube-wrapper" >
				<div class="cube-box" style="animation-name: '.$data['effect'].'">
					'.$images.'
				</div>

				<div class="cube-title">
					<span>'.$data['name'].'</span>
					
				</div>
			</div>
		</div>';

	return $html;
}
?>