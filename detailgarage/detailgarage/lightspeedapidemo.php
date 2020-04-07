<?php
die("saurabh");
error_reporting(0);

$conn = mysql_connect("localhost", "root", "saurabh123");
mysql_select_db('detailgarage', $conn);


$accountId = "158728";
$clientID = "0672eccd9fce74adca5422586d54dd773921ed3509076fe9def21192237e793b";
$clientSecret = "c081a77dc136fe4d9d9f4d1f92b7fe39e1ead446ea910ff97a8d12955c887ae4";
$tempCode = "80f09e793343b7b0f506d5c4e298ace5b8e18517";
// $redirectURI = "https://detailgarage.sourcesoftsolutions.com/?code=be1cc0ee76a473d360f7110204b194812bb854f8";



/* Light Speed Payment Gateway Integration Start */

 function generate_access_token() {
	$clientDetails = $this->config->item('client_details');
    $tokenURL = "https://cloud.lightspeedapp.com/oauth/access_token.php";
	$tempToken = $_GET['code'];
	$itemId = $this->input->post('item_id');
	// $postFields = [
	//     'client_id' => $clientDetails['clientID'],
	//     'client_secret' => $clientDetails['clientSecret'],
	//     'code' => '80f09e793343b7b0f506d5c4e298ace5b8e18517',
	//     'grant_type' => 'authorization_code'
	// ];

	$postFields = [
	    'client_id' => $this->input->post('client_id'),
	    'client_secret' => $this->input->post('client_secret'),
	    'code' => $this->input->post('code'),
	    'grant_type' => $this->input->post('grant_type')
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



public function get_item_post() {
	$clientDetails = $this->config->item('client_details');
	$accountId = $clientDetails['accountId'];
	$access_token = $this->input->post('access_token');
	$URL = "https://api.lightspeedapp.com/API/Account/".$accountId."/Item.json";
	// echo $URL; die;
	$curl = curl_init();
	$headr = array();
	$headr[] = 'Content-length: 0';
	$headr[] = 'Content-Type: application/x-www-form-urlencoded';
	$headr[] = 'Authorization: Bearer '.$access_token;
	// echo '<pre>'; print_r($headr); die;
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
	    echo "cURL Error #:" . $err;
	} else {
	    echo "<pre>$jsonString</pre>";
	}

}


public function get_item_details_post() {
	$clientDetails = $this->config->item('client_details');
	$accountId = $clientDetails['accountId'];
	$itemId = $this->input->post('item_id');
	$access_token = $this->input->post('access_token');
	$URL = "https://api.lightspeedapp.com/API/Account/".$accountId."/Item/".$itemId.".json";
	// echo $URL; die;
	$curl = curl_init();
	$headr = array();
	// $headr[] = 'Content-length: 0';
	$headr[] = 'Content-Type: application/x-www-form-urlencoded';
	$headr[] = 'Authorization: Bearer '.$access_token;
	// echo '<pre>'; print_r($headr); die;
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
	    echo "cURL Error #:" . $err;
	} else {
	    echo "<pre>$jsonString</pre>";
	}

}



public function create_item_post() {
	$jsonArray = file_get_contents('php://input');
	$clientDetails = $this->config->item('client_details');
	$accountId = $clientDetails['accountId'];
	$access_token = $this->input->post('access_token');
	$URL = "https://api.lightspeedapp.com/API/Account/".$accountId."/Item.json";

	//echo '<pre>'; print_r($jsonArray); die;

	$curl = curl_init();
	$headr = array();
	$headr[] = 'Content-Type: application/json';
	$headr[] = 'Authorization: Bearer '.$access_token;
	// echo '<pre>'; print_r($headr); die;
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
	//echo $response;die;
	$responseObj = json_decode($response);
	$jsonString = json_encode($responseObj, JSON_PRETTY_PRINT);

	$err = curl_error($curl);
	curl_close($curl);
	if ($err) {
	    echo "cURL Error #:" . $err;
	} else {
	    echo "<pre>$jsonString</pre>";
	}
}



public function update_item_post() { 
	$jsonArray = file_get_contents('php://input');
	$jsonArrayDecode = json_decode(file_get_contents('php://input'), true);
	$clientDetails = $this->config->item('client_details');
	$accountId = $clientDetails['accountId'];
	$itemId = $jsonArrayDecode['item_id'];
	$access_token = $this->input->post('access_token');
	$URL = "https://api.lightspeedapp.com/API/Account/".$accountId."/Item/".$itemId.".json";
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
	    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	    CURLOPT_CUSTOMREQUEST => "PUT",
	    CURLOPT_HTTPHEADER => $headr,
	    CURLOPT_POSTFIELDS => $jsonArray,
	));

	$response = curl_exec($curl);
	$responseObj = json_decode($response);
	$jsonString = json_encode($responseObj, JSON_PRETTY_PRINT);

	$err = curl_error($curl);
	curl_close($curl);
	if ($err) {
	    echo "cURL Error #:" . $err;
	} else {
	    echo "<pre>$jsonString</pre>";
	}
}



public function delete_item_post() { 
	$clientDetails = $this->config->item('client_details');
	$accountId = $clientDetails['accountId'];
	$itemId = $this->input->post('item_id');
	$access_token = $this->input->post('access_token');
	$URL = "https://api.lightspeedapp.com/API/Account/".$accountId."/Item/".$itemId.".json";
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
	    CURLOPT_CUSTOMREQUEST => "DELETE",
	    CURLOPT_HTTPHEADER => $headr,
	));

	$response = curl_exec($curl);
	$responseObj = json_decode($response);
	$jsonString = json_encode($responseObj, JSON_PRETTY_PRINT);

	$err = curl_error($curl);
	curl_close($curl);
	if ($err) {
	    echo "cURL Error #:" . $err;
	} else {
	    echo "<pre>$jsonString</pre>";
	}
}





/* Category Api Start */
// Get All Category-Sub Category List

public function get_category_list_post() { 
	$clientDetails = $this->config->item('client_details');
	$accountId = $clientDetails['accountId'];
	$access_token = $this->input->post('access_token');
	$URL = "https://api.lightspeedapp.com/API/Account/".$accountId."/Category.json";
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
	    echo "cURL Error #:" . $err;
	} else {
	    echo "<pre>$jsonString</pre>";
	}
}

// get category details
public function get_category_details_post() { 
	$clientDetails = $this->config->item('client_details');
	$accountId = $clientDetails['accountId'];
	$categoryId = $this->input->post('category_id');
	$access_token = $this->input->post('access_token');
	$URL = "https://api.lightspeedapp.com/API/Account/".$accountId."/Category/".$categoryId.".json";

	$curl = curl_init();
	$headr = array();
	$headr[] = 'Content-Type: application/x-www-form-urlencoded';
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
	    echo "cURL Error #:" . $err;
	} else {
	    echo "<pre>$jsonString</pre>";
	}
}


// Create Category
public function create_category_post() { 
	$jsonArray = file_get_contents('php://input');
	echo "<pre>"; print_r($jsonArray); die;
	$clientDetails = $this->config->item('client_details');
	$accountId = $clientDetails['accountId'];
	$access_token = $this->input->post('access_token');
	$URL = "https://api.lightspeedapp.com/API/Account/".$accountId."/Category.json";
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
	    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	    CURLOPT_CUSTOMREQUEST => "POST",
	    CURLOPT_HTTPHEADER => $headr,
	    CURLOPT_POSTFIELDS => $jsonArray,
	));

	$response = curl_exec($curl);
	$responseObj = json_decode($response);
	$jsonString = json_encode($responseObj, JSON_PRETTY_PRINT);

	$err = curl_error($curl);
	curl_close($curl);
	if ($err) {
	    echo "cURL Error #:" . $err;
	} else {
	    echo "<pre>$jsonString</pre>";
	}
}



// Update Category
public function update_category_post() { 
	$jsonArray = file_get_contents('php://input');
	$jsonArrayDecode = json_decode(file_get_contents('php://input'), true);
	$clientDetails = $this->config->item('client_details');
	$accountId = $clientDetails['accountId'];
	$categoryId = $jsonArrayDecode['category_id'];
	$access_token = $this->input->post('access_token');
	$URL = "https://api.lightspeedapp.com/API/Account/".$accountId."/Category/".$categoryId.".json";
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
	    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	    CURLOPT_CUSTOMREQUEST => "PUT",
	    CURLOPT_HTTPHEADER => $headr,
	    CURLOPT_POSTFIELDS => $jsonArray,
	));

	$response = curl_exec($curl);
	$responseObj = json_decode($response);
	$jsonString = json_encode($responseObj, JSON_PRETTY_PRINT);

	$err = curl_error($curl);
	curl_close($curl);
	if ($err) {
	    echo "cURL Error #:" . $err;
	} else {
	    echo "<pre>$jsonString</pre>";
	}
}

/* Category Api End */



// Delete Category
public function delete_category_post() { 
	$clientDetails = $this->config->item('client_details');
	$accountId = $clientDetails['accountId'];
	$categoryId = $this->input->post('category_id');
	$access_token = $this->input->post('access_token');
	$URL = "https://api.lightspeedapp.com/API/Account/".$accountId."/Category/".$categoryId.".json";
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
	    CURLOPT_CUSTOMREQUEST => "DELETE",
	    CURLOPT_HTTPHEADER => $headr,
	));

	$response = curl_exec($curl);
	$responseObj = json_decode($response);
	$jsonString = json_encode($responseObj, JSON_PRETTY_PRINT);

	$err = curl_error($curl);
	curl_close($curl);
	if ($err) {
	    echo "cURL Error #:" . $err;
	} else {
	    echo "<pre>$jsonString</pre>";
	}
}

/* Category Api End */




/* Light Speed Payment Gateway Integration End */

?>