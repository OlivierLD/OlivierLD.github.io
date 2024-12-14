<?php 

// Inspired from https://www.geeksforgeeks.org/saving-an-image-from-url-in-php/

// North-West Atlantic: https://tgftp.nws.noaa.gov/fax/PYAA12.gif 
// North-East Atlantic: https://tgftp.nws.noaa.gov/fax/PYAA11.gif 
// North Atlantic 500mb: https://tgftp.nws.noaa.gov/fax/PPAA10.gif


$origin = "https://tgftp.nws.noaa.gov/fax/PYAA12.gif";
$destination = "surface.west.atl.gif";

if (isset($_GET['origin'])) {
	$origin = $_GET['origin'];
}
if (isset($_GET['destination'])) {
	$destination = $_GET['destination'];
}

function file_get_contents_curl($url) { 
	$ch = curl_init(); 

	curl_setopt($ch, CURLOPT_HEADER, 0); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
	curl_setopt($ch, CURLOPT_URL, $url); 

	$data = curl_exec($ch); 
	curl_close($ch); 

	return $data; 
} 

try {

	$data = file_get_contents_curl($origin); 
	$fp = $destination; 

	file_put_contents( $fp, $data ); 

	header('Content-Type: plain/text; charset=utf-8');
	echo "File " . $origin . " downloaded as " . $destination . PHP_EOL;
} catch (Throwable $e) {
	echo "[Captured Throwable (3) for celestial.computer.php : " . $e . "] " . PHP_EOL;
}

?> 
