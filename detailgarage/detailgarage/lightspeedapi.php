<?php
// $postData = file_get_contents('php://input');
$postdata = json_decode(file_get_contents('php://input'), true);
// print_r($postData); die;

$jsonArrayData = json_decode($postData, true);
// echo "<pre>"; print_r($jsonArrayData); die;

// echo "<pre>"; print_r($postData); die;
$jsonArrayEncode = json_decode(file_get_contents('php://input'), true);
 // echo "<pre>"; print_r($jsonArrayEncode); die;

$jsonArrayDecode = json_decode($jsonArrayEncode);
// echo "<pre>"; print_r($jsonArrayDecode);

// $conn = mysql_connect("localhost", "root", "saurabh123");
// mysql_select_db('detailgarage', $conn);


define('accountId', "158728");
define('clientID', "0672eccd9fce74adca5422586d54dd773921ed3509076fe9def21192237e793b");
define('clientSecret', "c081a77dc136fe4d9d9f4d1f92b7fe39e1ead446ea910ff97a8d12955c887ae4");
define('tempCode', "59b61f4afca86dba2709bd90ba773be9b42de89c");
define('accessToken', "9e7c408de8ffd15d78ce55f082aced08c866fe07");


/* Light Speed Payment Gateway Integration Start */
// echo "<pre>"; print_r($_POST); die;
if($_POST['type'] == "generate_access_token"){
	function generate_access_token() {
    	$tokenURL = "https://cloud.lightspeedapp.com/oauth/access_token.php";
    	$postFields = [
		    'client_id' => clientID,
		    'client_secret' => clientSecret,
		    'code' => tempCode,
		    'grant_type' => 'authorization_code'
		];

		$curl = curl_init();
		curl_setopt_array($curl, array(
		    CURLOPT_URL => $tokenURL,
		    CURLOPT_RETURNTRANSFER => true,
		    CURLOPT_ENCODING => "",
		    CURLOPT_MAXREDIRS => 10,
		    CURLOPT_TIMEOUT => 30,
		    CURLOPT_CUSTOMREQUEST => "POST",
		    CURLOPT_POSTFIELDS => $postFields
		));
		$response = curl_exec($curl);
		$responseObj = json_decode($response);
		$jsonString = json_encode($responseObj, JSON_PRETTY_PRINT);
		$err = curl_error($curl);
		curl_close($curl);
		if ($err) {
		    echo "cURL Error #:" . $err;
		} else {
		    if (array_key_exists('access_token', $responseObj)) {
		        echo "<h2>Access Token Returned</h2>";
		    } else {
		        echo "<h2>It looks like there was an error.</h2>";
		    };
		    echo "<pre>$jsonString</pre>";
		}
	}
	generate_access_token();
}


/* Function for get all category list from lightspeed api start */

if($postdata['type'] == "get_category_list"){
	function get_category_list() {
		$access_token = accessToken;
		$URL = "https://api.lightspeedapp.com/API/Account/".accountId."/Category.json";
		$curl = curl_init();
		$headr = array();
		$headr[] = 'Content-Type: application/json';
		$headr[] = 'Authorization: Bearer '.$access_token;
		curl_setopt_array($curl, array(
			CURLOPT_URL => $URL,
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_ENCODING => "",
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_TIMEOUT => 30,
			CURLOPT_CUSTOMREQUEST => "GET",
			CURLOPT_HTTPHEADER => $headr,
		));
	
		$response = curl_exec($curl);
		$responseObj = json_decode($response);
		$jsonString = json_encode($responseObj, JSON_PRETTY_PRINT);
	
		$err = curl_error($curl);
		curl_close($curl);
		if ($err) {
			echo json_encode($err);
		} else {
			echo  json_encode($jsonString);
		}
		exit;
	}
}

/* Function for get all category list from lightspeed api end */


if($postdata['type'] == "create_category"){
	$postFields = [
		'name' => $postdata['name'],
		'fullPathName' => $postdata['fullPathName'],
		'parentID' => $postdata['parentID']
	];
	$jsonArray = json_encode($postFields);
	// $access_token=$postdata1['access_token'];
	//echo json_encode($postFields);
	
	$URL = "https://api.lightspeedapp.com/API/Account/".accountId."/Category.json";
	$curl = curl_init();
	$headr = array();
	$headr[] = 'Content-Type: application/json';
	$headr[] = 'Authorization: Bearer '.accessToken;
	curl_setopt_array($curl, array(
		CURLOPT_URL => $URL,
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_ENCODING => "",
		CURLOPT_MAXREDIRS => 10,
		CURLOPT_TIMEOUT => 30,
		CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		CURLOPT_CUSTOMREQUEST => "POST",
		CURLOPT_HTTPHEADER => $headr,
		CURLOPT_POSTFIELDS => $jsonArray,
	));

	$response = curl_exec($curl);
	// $responseObj = json_decode($response);
	// $jsonString = json_encode($responseObj, JSON_PRETTY_PRINT);

	$err = curl_error($curl);
	curl_close($curl);
	if ($err) {
		echo $err;
	} else {
		echo $response;
	}
	exit;
}

/* Light Speed Payment Gateway Integration End */


/* Function for update category list from lightspeed api start */

if($postdata['type'] == "update_category"){
	$postFields = [
		'name' => $postdata['name'],
		'fullPathName' => $postdata['fullPathName'],
		'parentID' => $postdata['parentID']
	];
	$categoryId = $postdata['light_speed_cat_id'];
	$jsonArray = json_encode($postFields);
	// $access_token=$postdata1['access_token'];
	$URL = "https://api.lightspeedapp.com/API/Account/".accountId."/Category/".$categoryId.".json";
	$curl = curl_init();
	$headr = array();
	$headr[] = 'Content-Type: application/json';
	$headr[] = 'Authorization: Bearer '.accessToken;
	curl_setopt_array($curl, array(
		CURLOPT_URL => $URL,
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_ENCODING => "",
		CURLOPT_MAXREDIRS => 10,
		CURLOPT_TIMEOUT => 30,
		CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		CURLOPT_CUSTOMREQUEST => "PUT",
		CURLOPT_HTTPHEADER => $headr,
		CURLOPT_POSTFIELDS => $jsonArray,
	));

	$response = curl_exec($curl);
	// $responseObj = json_decode($response);
	// $jsonString = json_encode($responseObj, JSON_PRETTY_PRINT);

	$err = curl_error($curl);
	curl_close($curl);
	if ($err) {
		echo $err;
	} else {
		echo $response;
	}
	 exit;
}

/* Function for update category list from lightspeed api end */


/* Function for delete category list from lightspeed api start */

if($postdata['type'] == "delete_category"){
	$categoryId = $postdata['light_speed_cat_id'];
	$URL = "https://api.lightspeedapp.com/API/Account/".accountId."/Category/".$categoryId.".json";
	$curl = curl_init();
	$headr = array();
	$headr[] = 'Content-Type: application/json';
	$headr[] = 'Authorization: Bearer '.accessToken;
	curl_setopt_array($curl, array(
		CURLOPT_URL => $URL,
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_ENCODING => "",
		CURLOPT_MAXREDIRS => 10,
		CURLOPT_TIMEOUT => 30,
		CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		CURLOPT_CUSTOMREQUEST => "DELETE",
		CURLOPT_HTTPHEADER => $headr,
	));

	$response = curl_exec($curl);
	$err = curl_error($curl);
	curl_close($curl);
	if ($err) {
		echo $err;
	} else {
		echo $response;
	}
	 exit;
}

/* Function for delete category list from lightspeed api end */



/* Function for add product on lightspeed api start */

if($postdata['type'] == "create_product"){
	$postFields = [
		'defaultCost' => $postdata['defaultCost'],
		'description' => $postdata['description'],
		'categoryID' => $postdata['categoryID']
	];
	$jsonArray = json_encode($postFields);
	// $access_token=$postdata1['access_token'];
	//echo json_encode($postFields);
	$URL = "https://api.lightspeedapp.com/API/Account/".accountId."/Item.json";
	$curl = curl_init();
	$headr = array();
	$headr[] = 'Content-Type: application/json';
	$headr[] = 'Authorization: Bearer '.accessToken;
	curl_setopt_array($curl, array(
		CURLOPT_URL => $URL,
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_ENCODING => "",
		CURLOPT_MAXREDIRS => 10,
		CURLOPT_TIMEOUT => 30,
		CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		CURLOPT_CUSTOMREQUEST => "POST",
		CURLOPT_HTTPHEADER => $headr,
		CURLOPT_POSTFIELDS => $jsonArray,
	));

	$response = curl_exec($curl);
	// $responseObj = json_decode($response);
	// $jsonString = json_encode($responseObj, JSON_PRETTY_PRINT);

	$err = curl_error($curl);
	curl_close($curl);
	if ($err) {
		echo $err;
	} else {
		echo $response;
	}
	 exit;
}

/* Function for add product on lightspeed api End */


/* Function for update product on lightspeed api start */

if($postdata['type'] == "update_product"){
	$postFields = [
		'defaultCost' => $postdata['defaultCost'],
		'description' => $postdata['description'],
		'categoryID' => $postdata['categoryID']
	];
	$jsonArray = json_encode($postFields);
	$itemId = $postdata['light_speed_product_id'];
	// $access_token=$postdata1['access_token'];
	//echo json_encode($postFields);
	$URL = "https://api.lightspeedapp.com/API/Account/".accountId."/Item/".$itemId.".json";
	$curl = curl_init();
	$headr = array();
	$headr[] = 'Content-Type: application/json';
	$headr[] = 'Authorization: Bearer '.accessToken;
	curl_setopt_array($curl, array(
		CURLOPT_URL => $URL,
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_ENCODING => "",
		CURLOPT_MAXREDIRS => 10,
		CURLOPT_TIMEOUT => 30,
		CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		CURLOPT_CUSTOMREQUEST => "PUT",
		CURLOPT_HTTPHEADER => $headr,
		CURLOPT_POSTFIELDS => $jsonArray,
	));

	$response = curl_exec($curl);
	// $responseObj = json_decode($response);
	// $jsonString = json_encode($responseObj, JSON_PRETTY_PRINT);

	$err = curl_error($curl);
	curl_close($curl);
	if ($err) {
		echo $err;
	} else {
		echo $response;
	}
	 exit;
}

/* Function for update product on lightspeed api End */


/* Function for delete product list from lightspeed api start */

if($postdata['type'] == "delete_product"){
	$itemId = $postdata['light_speed_product_id'];
	$URL = "https://api.lightspeedapp.com/API/Account/".accountId."/Item/".$itemId.".json";
	$curl = curl_init();
	$headr = array();
	$headr[] = 'Content-Type: application/json';
	$headr[] = 'Authorization: Bearer '.accessToken;
	curl_setopt_array($curl, array(
		CURLOPT_URL => $URL,
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_ENCODING => "",
		CURLOPT_MAXREDIRS => 10,
		CURLOPT_TIMEOUT => 30,
		CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		CURLOPT_CUSTOMREQUEST => "DELETE",
		CURLOPT_HTTPHEADER => $headr,
	));

	$response = curl_exec($curl);
	$err = curl_error($curl);
	curl_close($curl);
	if ($err) {
		echo $err;
	} else {
		echo $response;
	}
	 exit;
}

/* Function for delete product list from lightspeed api end */



?>
