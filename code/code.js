function editUn() {
  $('.edit').each(function() {
    var classedate = $(this).attr('class');
    var messettings = {
      event: 'click',
      onblur: 'submit',
      placeholder: ''
    };
    if (classedate == 'edit editdate') {
      messettings.type = 'date';
    } else if (classedate == 'edit editheure') {
      messettings.type = 'time';
    };

    $(this).editable(function(value, messettings) {
      editDeux();
      return value;
    }, messettings);
  });
}

function editDeux() {
  var table = document.getElementById('tbodyID');
  var lignes = table.rows.length;
  var miarrey = [];

  for (i = 0; i <  lignes; i++) {

    var ligne = table.rows[i];

    var colonneDate = ligne.cells[0];
    var colonneContrat = ligne.cells[1];
    var colonneClient = ligne.cells[2];
    var colonneBus = ligne.cells[3];
    var colonneOdoIN = ligne.cells[4];
    var colonneOdoOUT = ligne.cells[5];
    var colonnekmTOTAL = ligne.cells[6];
    var colonneTempsIN = ligne.cells[7];
    var colonneTempsOUT = ligne.cells[8];
    var colonneTempsTOTAL = ligne.cells[9];
    var colonneEtat = ligne.cells[10];
    var idUnique = $('#semaineDU').html();

    var id = i;
    var date = colonneDate.getElementsByTagName('input')[0] ? colonneDate.getElementsByTagName('input')[0].value : moment(ligne.cells[0].innerHTML, 'll').format('L');
    var contrat = colonneContrat.getElementsByTagName('input')[0] ? colonneContrat.getElementsByTagName('input')[0].value : ligne.cells[1].innerHTML;
    var client = colonneClient.getElementsByTagName('input')[0] ? colonneClient.getElementsByTagName('input')[0].value : ligne.cells[2].innerHTML;
    var bus = colonneBus.getElementsByTagName('input')[0] ? colonneBus.getElementsByTagName('input')[0].value : ligne.cells[3].innerHTML;
    var odoIN = colonneOdoIN.getElementsByTagName('input')[0] ? colonneOdoIN.getElementsByTagName('input')[0].value : ligne.cells[4].innerHTML;
    var odoOUT = colonneOdoOUT.getElementsByTagName('input')[0] ? colonneOdoOUT.getElementsByTagName('input')[0].value : ligne.cells[5].innerHTML;
    var kmTOTAL = colonnekmTOTAL.getElementsByTagName('input')[0] ? colonnekmTOTAL.getElementsByTagName('input')[0].value : ligne.cells[6].innerHTML;
    var tempsIN = colonneTempsIN.getElementsByTagName('input')[0] ? colonneTempsIN.getElementsByTagName('input')[0].value : ligne.cells[7].innerHTML;
    var tempsOUT = colonneTempsOUT.getElementsByTagName('input')[0] ? colonneTempsOUT.getElementsByTagName('input')[0].value : ligne.cells[8].innerHTML;
    var tempsTOTAL = colonneTempsTOTAL.getElementsByTagName('input')[0] ? colonneTempsTOTAL.getElementsByTagName('input')[0].value : ligne.cells[9].innerHTML;
    var etat = colonneEtat.getElementsByTagName('input')[0] ? colonneEtat.getElementsByTagName('input')[0].value : ligne.cells[10].innerHTML;

    var semaineDU = moment($('#semaineDU').html(), 'll').format('L');
    var semaineAU = moment($('#semaineAU').html(), 'll').format('L');

    //            if(moment(date, 'L').isBetween(semaineDU, semaineAU,'week', []) == false) {
    //                alert("Ta date n'est pas dans la bonne semaine, dude.");
    //                colonneDate.getElementsByTagName('input')[0].value = "Oups. Date invalide";
    //                throw new Error("date invalide");
    //            }

    var idx = i < 10 ? '0' + i : i;

    idUnique = faireUnID(idUnique, idx);

    var ligneObjet = {
      idUnique: idUnique,
      date: date,
      contrat: contrat,
      client: client,
      bus: bus,
      odoIN: odoIN,
      odoOUT: odoOUT,
      // kmTOTAL: kmTOTAL,
      tempsIN: tempsIN,
      tempsOUT: tempsOUT,
      tempsTOTAL: tempsTOTAL,
      etat: etat
    };

    //            if(date != 'Invalid date') {
    //                miarrey.push(ligneObjet);
    //                console.log(miarrey);
    //            }

    miarrey.push(ligneObjet);
    console.log(miarrey);

  };
  $.ajax({
    url: 'php/sauvegarde.php',
    type: 'POST',
    data: {
      data: miarrey
    },
    success: function(data) {
      data = JSON.parse(data);
      for (i = 0; i <  data.length; i++) {
        console.log(data[i].date);
        moment(data[i].date, 'L').isValid() ? document.getElementById('tbodyID').rows[i].cells[0].innerHTML = moment(data[i].date, 'L').format('ll') : document.getElementById('tbodyID').rows[i].cells[0].innerHTML = "";
      };
      console.log(data);
      calculateurDeKm();
      lesHeures();
    },
    error: function(data, textStatus, errorThrown) {
      console.log("Statut: " + textStatus);
      console.log("Erreur: " + errorThrown);
    }
  })
}

function faireUnID(date, rang) {
  var table = document.getElementById('tbodyID');
  var lignes = table.rows.length;
  var dateFormat = moment(date, 'll').format('YYYYww');
  var idUnique = dateFormat + rang;

  return idUnique;
}

function semaine() {

  $('#semaineDU').on('touchstart dblclick', function() {

    var def = $('#semaineDU').html();

    $('#semaineDU').html("");

    if (document.getElementById('semaineDU').hasChildNodes() !== true) {

      var element = document.createElement('input');
      element.type = "date";
      element.value = moment(def, 'll').isValid() ? moment(def, 'll').format('L') : moment().format('L');
      element.autofocus = true;

      var semaineDU = document.getElementById('semaineDU');
      semaineDU.appendChild(element);
    }

  })

  $('#semaineDU').focusout(function() {
    var valeur = $('#semaineDU').find('input').val();

    $('#semaineDU').html(moment(valeur).startOf('week').format('ll'));
    $('#semaineAU').html(moment($('#semaineDU').html(), 'll').add(6, 'd').format('ll'));

    var debutdesemaine = $('#semaineDU').html();

    var datesemaine = moment(debutdesemaine, 'll').format('YYYYww');
    chargerData(datesemaine);

  });
}

function sortable() {
  $("#tbodyID").sortable({
    stop: function(event, ui) {
      editDeux();
    },
    axis: 'y'
  });
}

function chargerData(datesemaine) {

  var table = document.getElementById('tbodyID');

  $.ajax({
    dataType: "json",
    type: "POST",
    url: "php/retourduphp.php",
    data: {
      data: datesemaine
    }
  }).done(
    function(data) {

      if (data.length === 0) {
        for (i = 0; i < table.rows.length; i++) {
          var ligne = table.rows[i];

          $(ligne.cells[0]).html("");
          $(ligne.cells[1]).html("");
          $(ligne.cells[2]).html("");
          $(ligne.cells[3]).html("");
          $(ligne.cells[4]).html("");
          $(ligne.cells[5]).html("");
          $(ligne.cells[6]).html("");
          $(ligne.cells[7]).html("");
          $(ligne.cells[8]).html("");
          $(ligne.cells[9]).html("");
          $(ligne.cells[10]).html("");
        }
      } else {
        for (i = 0; i < table.rows.length; i++) {
          var ligne = table.rows[i];

          var date = data[i].date;

          moment(date, 'L').isValid() ? date = moment(date, 'L').format('ll') : date = '';

          var contrat = data[i].contrat;
          var client = data[i].client;
          var bus = data[i].bus;
          var odoIN = data[i].odoIN;
          var odoOUT = data[i].odoOUT;
          var kmTOTAL = data[i].kmTOTAL;
          var tempsIN = data[i].tempsIN;
          var tempsOUT = data[i].tempsOUT;
          var tempsTOTAL = data[i].tempsTOTAL;
          var etat = data[i].etat;

          $(ligne.cells[0]).html(date);
          contrat === '0' ? $(ligne.cells[1]).html("") : $(ligne.cells[1]).html(contrat);
          $(ligne.cells[2]).html(client);
          bus === '0' ? $(ligne.cells[1]).html("") : $(ligne.cells[3]).html(bus);
          odoIN === '0' ? $(ligne.cells[1]).html("") : $(ligne.cells[4]).html(odoIN);
          odoOUT === '0' ? $(ligne.cells[1]).html("") : $(ligne.cells[5]).html(odoOUT);
          kmTOTAL === '0' ? $(ligne.cells[1]).html("") : $(ligne.cells[6]).html(kmTOTAL);
          $(ligne.cells[7]).html(tempsIN);
          $(ligne.cells[8]).html(tempsOUT);
          $(ligne.cells[9]).html(tempsTOTAL);
          $(ligne.cells[10]).html(etat);

        }
      }
    });
}

function calculateurDeKm() {

  var table = document.getElementById('tbodyID');
  var lignes = table.rows.length;

  for (i = 0; i <  lignes; i++) {
    var somme;
    var ligne = table.rows[i];
    var cellulecinq = Number(ligne.cells[5].innerHTML);
    var cellulequatre = Number(ligne.cells[4].innerHTML);

    somme = cellulecinq - cellulequatre;

    if (isNaN(somme) || somme === 0) {
      ligne.cells[6].innerHTML = '';
    } else {
      ligne.cells[6].innerHTML = somme;
    }
  }

}

function lesHeures() {
  var table = document.getElementById('tbodyID');
  var lignes = table.rows.length;

  for (i = 0; i < lignes; i++) {

    var row = table.rows[i];

    //        console.log(row.cells[7].innerHTML)

    var heureINpasFormatee = row.cells[7].innerHTML;
    var heureOUTpasFormatee = row.cells[8].innerHTML;

    var heureINformatee = moment(heureINpasFormatee, 'hh:mm');
    var heureOUTformatee = moment(heureOUTpasFormatee, 'hh:mm');

    var heureTOTALE = heureOUTformatee - heureINformatee;

    if (heureTOTALE <= 0) {
      heureOUTformatee.add(1, 'd');
    }

    var heureTOTALEformatee = heureOUTformatee.diff(heureINformatee, 'hours', true);

    heureTOTALEformatee = Math.ceil(heureTOTALEformatee * 4) / 4;

    if (isNaN(heureTOTALEformatee)) {
      row.cells[9].innerHTML = "";
    } else {
      row.cells[9].innerHTML = heureTOTALEformatee;
    }
  }
}
