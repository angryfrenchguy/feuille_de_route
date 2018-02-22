<?php
$serveur = "localhost";
$useur = "root";
$contrapass = "root";
$bd = "tada";

$conx = new mysqli($serveur, $useur, $contrapass, $bd);

if ($conx->connect_error) {
    die("échec de la connexion: " . $conx->connect_error);
}

$data = $_POST;

$lignes = array();

foreach($data[data] as $value) {
    $val = $value;
    $lignes[] = $val;
}

foreach($lignes as $key => $ligne) {

    if($ligne[date] == "Invalid date" AND $ligne[contrat] == "" AND $ligne[client] == "" AND $ligne[bus] == "" AND $ligne[odoIN] == "" AND $ligne[odoOUT] == "" AND $ligne[kmTOTAL] == "" AND $ligne[tempsIN] == "" AND $ligne[tempsOUT] == "" AND $ligne[tempsTOTAL] == "" AND $ligne[etat] == "") {
        mysqli_query($conx, "DELETE FROM feuille_de_temps WHERE idUnique='" . $ligne[idUnique] . "'");
    } else {
        mysqli_query($conx,
                    "INSERT INTO feuille_de_temps (idUnique, date, contrat, client, bus, odoIN, odoOUT, odoTOTAL, tempsIN, tempsOUT, tempsTOTAL, etat) VALUES ('"
                    . $ligne[idUnique] .
                    "','" . $ligne[date] .
                    "','" . $ligne[contrat] .
                    "','" . $ligne[client] .
                    "','" . $ligne[bus] .
                    "','" . $ligne[odoIN] .
                    "','" . $ligne[odoOUT] .
                    "','" . "odoOUT-odoIN" .
                    "','" . $ligne[tempsIN] .
                    "','" . $ligne[tempsOUT] .
                    "','" . $ligne[tempsTOTAL] .
                    "','" . $ligne[etat] .
                    "')
                    ON DUPLICATE KEY UPDATE
                    date='" . $ligne[date] .
                    "', contrat='" . $ligne[contrat] .
                    "', client='" . $ligne[client] .
                    "', bus ='" . $ligne[bus] .
                    "', odoIN ='" . $ligne[odoIN] .
                    "', odoOUT ='" . $ligne[odoOUT] .
                    "', odoTOTAL ='" . $ligne[kmTOTAL] .
                    "', tempsIN ='" . $ligne[tempsIN] .
                    "', tempsOUT ='" . $ligne[tempsOUT] .
                    "', tempsTOTAL ='" . $ligne[tempsTOTAL] .
                    "', etat ='" . $ligne[etat] .
                    "'"
        );
    }
}

echo json_encode($_POST[data]);

$conx->close();
