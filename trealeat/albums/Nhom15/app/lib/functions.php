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
	$data = $d['trealet'];
	
	
	return $data;
}
function getFullLinkData($d) {
	$data = $d;
	for ($i = 0; $i < count($data['locations']); $i++) {
		$l = $data['locations'][$i];
		$media = array();
		for ($j = 0; $j < count($l['media']); $j++) {
			if (is_numeric($l['media'][$j])) {
				$idata = fetchItemData($l['media'][$j]);
				
				$item['name'] = $idata['title'];
				$item['description'] = $idata['desc'];
				$item['type'] = $ext = strtoupper(pathinfo($idata['url_full'], PATHINFO_EXTENSION));
				
				if ($item['type'] == 'YTB') {
					$video = trim(file_get_contents('https://hcloud.trealet.com'.$idata['url_full']));
					// print_r($video);
					$item['url'] = 'https://www.youtube.com/embed/'.$video;
					// print_r($item['url']);
				} else if ($item['type'] === 'TXT') {
					$item['url'] = trim(file_get_contents('https://hcloud.trealet.com'.$idata['url_full']));
					$item['type'] = 'IFRAME';
				} else {
					$item['url'] = 'https://hcloud.trealet.com'.$idata['url_full'];
				}

				array_push($media, $item);
			} else {
				array_push($media, $l['media'][$j]);
			}
		}
		$data['locations'][$i]['media'] = $media; 	
	}
	return $data;
}

function parseTrealetJSON($json_string,$exec){
	$d = json_decode($json_string, true);	
	if(!$d) die('Cannot parse the trealet content!');	
	if(!isset($d['trealet'])) die('It is not a trealet!');	
	if($d['trealet']['exec']!=$exec) die('Wrong executable name!');
	return $data;
}

function fetchItemData($item_url){
	if(is_numeric($item_url)){
		$item_url = 'https://hcloud.trealet.com/tiny'.$item_url.'/?json';
		$json_string = file_get_contents($item_url);
		if(!$json_string) return;	
		$d = json_decode($json_string, true);
		return $d['image'];
	}
	else {
		return $item_url;
	}
}

function htmlItem($trealet_id,$nij,$idata, $css_item_id='', $css_input_id=''){
	if(isset($idata['url_full']))//Show up the data item
	{
		$title 	  = isset($idata['title'])?$idata['title']:'';;
		$desc	  = isset($idata['desc'])?$idata['desc']:'';
		$url_full = isset($idata['url_full'])?$idata['url_full']:'';
		$path     = isset($idata['path'])?$idata['path']:'';
		
		$vobj	  = '';
		
		//Supported format APP, FLA, FLV, GIF, GLB, HTM, HTML, JPEG, JPG, M4A, M4V, MP3, MP4, PDF, PNG, PPS, PPT, TIF, TIFF, TXT		
		
		$ext = strtoupper(pathinfo($url_full, PATHINFO_EXTENSION));
		
		//items
		if($ext=='GIF' || $ext=='JPEG'|| $ext=='JPG'|| $ext=='PNG'|| $ext=='TIF'|| $ext=='TIFF'){
			$vobj .= '<center><img src="'.$url_full.'" style="max-width:90%;"></center>';
		} 
		
		//Text
		if($ext=='TXT'){
			$vobj .= file_get_contents('https://hcloud.trealet.com'.$url_full); //For embedded video
			//$vobj = '<iframe src="'.$url_full.'"></iframe>';
		}
		
		//Youtube
		if($ext=="YTB"){
			$vid = file_get_contents('https://hcloud.trealet.com'.$url_full);
			$vobj .= '<div style="position: relative; width: 90%; height: 0; padding-bottom: 50%;">';
			$vobj .= '<iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/'.$vid.'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
			$vobj .= '</div>';
		}
		
		//GLB for 3D
		if($ext=='GLB'){
			$vobj .= '<div style="position: relative; width: 90%; height: 0; padding-bottom: 50%;">';
			$vobj .= '<iframe src="https://hcloud.trealet.com/h3r/embed/?glb='.$url_full.'" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>';
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
		
		$html = '<div id="'.$css_item_id.'"><h1>'.$title.'</h1><center>'.$vobj.'</center><br><p>'.$desc.'</p></div>';
		return $html;
	}else if(isset($idata['input']) && isset($idata['input']['type'])){
		$type 	  = $idata['input']['type'];
		$title 	  = isset($idata['input']['label'])?$idata['input']['label']:'';
		$desc	  = isset($idata['input']['desc'])?$idata['input']['desc']:'';
		$vobj 	  = '';
		if($type=='picture'){
			$vobj = '<iframe style="position: relative; width: 90%;" src="https://hcloud.trealet.com/trealet-schema/input-picture/index.php?tr_id='.$trealet_id.'&nij='.$nij.'" title="'.$title.'" frameborder="0" allow="camera" onload="this.style.height=(this.contentWindow.document.body.scrollHeight+200)+\'px\';"></iframe>';
		}else if($type=='audio'){
			$vobj = '<iframe style="position: relative; width: 100%;" src="https://hcloud.trealet.com/trealet-schema/input-audio/index.php?tr_id='.$trealet_id.'&nij='.$nij.'" title="'.$title.'" frameborder="0" allow="microphone" onload="this.style.height=(this.contentWindow.document.body.scrollHeight+100)+\'px\';"></iframe>';
		}else if($type=='form'){
			$vobj = '<iframe style="position: relative; width: 90%;" src="https://hcloud.trealet.com/trealet-schema/input-form/index.php?tr_id='.$trealet_id.'&nij='.$nij.'" title="Input data from a form" frameborder="0" onload="this.style.height=(this.contentWindow.document.body.scrollHeight+250)+\'px\';"></iframe>';
		}else if($type=='qr'){
			$vobj 	 .= '<iframe style="position: relative; width: 90%;" src="https://hcloud.trealet.com/trealet-schema/input-qr/index.php?tr_id='.$trealet_id.'&nij='.$nij.'" title="Scan QR code from camera" frameborder="0" allow="camera" onload="this.style.height=(this.contentWindow.document.body.scrollHeight+200)+\'px\';"></iframe>';
		}
		$html 	  = '<div id="'.$css_input_id.'"><h1>'.$title.'</h1><center>'.$vobj.'</center><br><p>'.$desc.'</p></div>';
		return $html;
	}
}
?>