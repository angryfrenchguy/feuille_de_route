function quelleClasse(ceci) {
        
        var classedate = $(ceci).attr('class');
        var messettings;
        
        if(classedate == 'edit editdate') {
        messettings = {
        event: 'touchstart dblclick',
        onblur: 'submit',
        placeholder: 'this',
        type: ''
    };
            
        } else {
        messettings = {
        event: 'touchstart dblclick',
        onblur: 'submit',
        placeholder: ''
    };        
            
        }; 
    return messettings;
    
}

function editUn() {
    $('.edit').each( function() {
        
        var classedate = $(this).attr('class');
        var messettings;
        
        if(classedate == 'edit editdate') {
        messettings = {
        event: 'touchstart dblclick',
        onblur: 'submit',
        placeholder: '',
        type: 'date'
    };
            
        } else {
        messettings = {
        event: 'touchstart dblclick',
        onblur: 'submit',
        placeholder: ''
    };        
            
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
        
        var dateOrNot = function() {
            if($(this).attr('class') == 'edit edidate') {
                return 'date';
            }
        }
        
        for(i = 0; i < lignes; i++) {
            
            var ligne = table.rows[i];
            
            var colonneDate = ligne.cells[0];
            var colonneContrat = ligne.cells[1];
            var colonneClient = ligne.cells[2];
            var colonneBus = ligne.cells[3];
            var colonneOdoIN = ligne.cells[4];
            var colonneOdoOUT = ligne.cells[5];
            var colonneOdoTOTAL = ligne.cells[6]; 
            var colonneTempsIN = ligne.cells[7];
            var colonneTempsOUT = ligne.cells[8];
            var colonneTempsTOTAL = ligne.cells[9];
            var colonneEtat = ligne.cells[10];
            var idUnique = $('#semaineDU').html();
            
            var id = i;
            var date = colonneDate.getElementsByTagName('input')[0] ? colonneDate.getElementsByTagName('input')[0].value : moment(ligne.cells[0].innerHTML, 'LL').format('L');
            var contrat = colonneContrat.getElementsByTagName('input')[0] ? colonneContrat.getElementsByTagName('input')[0].value : ligne.cells[1].innerHTML;
            var client = colonneClient.getElementsByTagName('input')[0] ? colonneClient.getElementsByTagName('input')[0].value : ligne.cells[2].innerHTML;
            var bus = colonneBus.getElementsByTagName('input')[0] ? colonneBus.getElementsByTagName('input')[0].value : ligne.cells[3].innerHTML;
            var odoIN = colonneOdoIN.getElementsByTagName('input')[0] ? colonneOdoIN.getElementsByTagName('input')[0].value : ligne.cells[4].innerHTML;
            var odoOUT = colonneOdoOUT.getElementsByTagName('input')[0] ? colonneOdoOUT.getElementsByTagName('input')[0].value : ligne.cells[5].innerHTML;
            var odoTOTAL = colonneOdoTOTAL.getElementsByTagName('input')[0] ? colonneOdoTOTAL.getElementsByTagName('input')[0].value : ligne.cells[6].innerHTML;
            var tempsIN = colonneTempsIN.getElementsByTagName('input')[0] ? colonneTempsIN.getElementsByTagName('input')[0].value : ligne.cells[7].innerHTML;
            var tempsOUT = colonneTempsOUT.getElementsByTagName('input')[0] ? colonneTempsOUT.getElementsByTagName('input')[0].value : ligne.cells[8].innerHTML;
            var tempsTOTAL = colonneTempsTOTAL.getElementsByTagName('input')[0] ? colonneTempsTOTAL.getElementsByTagName('input')[0].value : ligne.cells[9].innerHTML;
            var  etat= colonneEtat.getElementsByTagName('input')[0] ? colonneEtat.getElementsByTagName('input')[0].value : ligne.cells[10].innerHTML;
    
            var semaineDU = moment($('#semaineDU').html(), 'LL').format('L');
            var semaineAU = moment($('#semaineAU').html(), 'LL').format('L');
            
            if(moment(date, 'L').isBetween(semaineDU, semaineAU,'week', []) == false) {
                alert("Ta date n'est pas dans la bonne semaine, dude.");
                colonneDate.getElementsByTagName('input')[0].value = "Oups. Date invalide";
                throw new Error("date invalide");
            }
            
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
                odoTOTAL: odoTOTAL,
                tempsIN: tempsIN,
                tempsOUT: tempsOUT,
                tempsTOTAL: tempsTOTAL,
                etat: etat
            };
            
            miarrey.push(ligneObjet);
};
        $.ajax({
            url: 'http://localhost:8888/sauvegarde.php',
            type: 'POST',
            data: { data: miarrey },
            success: function(data) {
                data = JSON.parse(data);
                for(i = 0; i < data.length; i++) {
                    moment(data[i].date, 'L').isValid() ? document.getElementById('tbodyID').rows[i].cells[0].innerHTML = moment(data[i].date, 'L').format('LL') : document.getElementById('tbodyID').rows[i].cells[0].innerHTML = "";
                };
                console.log(data);
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
        var dateFormat = moment(date, 'LL').format('YYYYww');
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
        element.value = moment(def, 'LL').format('L');
        element.autofocus = true;
        
        var semaineDU = document.getElementById('semaineDU');
        semaineDU.appendChild(element);
    }
    
    })
    
    $('#semaineDU').focusout(function() {
        var valeur = $('#semaineDU').find('input').val();
        
        $('#semaineDU').html(moment(valeur).startOf('week').format('LL'));
        $('#semaineAU').html(moment($('#semaineDU').html(), 'LL').add(6, 'd').format('LL'));
    });
}

function sortable() {
    $( "#tbodyID" ).sortable({
        stop: function(event, ui) {
            editDeux();
        },
        axis:'y'
    });
}