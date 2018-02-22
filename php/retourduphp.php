<?php
$serveur = "localhost";
$useur = "root";
$contrapass = "root";
$bd = "tada";

// Create connection
$conn = new mysqli($serveur, $useur, $contrapass, $bd);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//$sth = mysqli_query($conn,"SELECT * FROM feuille_de_temps WHERE idUnique LIKE '200001%%'");
// $sth = mysqli_query($conn,"SELECT * FROM feuille_de_temps WHERE idUnique LIKE '" . $_POST['data'] . "%%'");
$sth = mysqli_query($conn,"SELECT *,odoOUT-odoIN AS kmTOTAL FROM feuille_de_temps WHERE idUnique LIKE '" . $_POST['data'] . "%%'");
//$sth = mysqli_query($conn,"SELECT * FROM feuille_de_temps");
$rows = array();
while ($r = mysqli_fetch_assoc($sth)) {
    $rows[] = $r;
}

$jsondata = json_encode($rows, JSON_PRETTY_PRINT);

$chose = json_encode[$sth];

echo $jsondata;

$conn->close();
