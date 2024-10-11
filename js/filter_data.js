


function check_if_obj_in_search_nazwa_zamierzenia_bud(item){
    key = "rodzaj_zam_budowlanego";
    key2 = "nazwa_zamierzenia_bud";
    if(headers_from_file.includes(key2)){
        key = key2;
    }
    if(!document.getElementById(item[key])){
        return false;
    }
    return document.getElementById(item[key]).checked;
}
function check_if_obj_in_search_organs(item){
    key="nazwa_organu";
    if(!document.getElementById(item[key])){
        return false;
    }
    return document.getElementById(item[key]).checked;
}
function check_if_obj_in_search_categories(item){
    key="kategoria";
    if(!document.getElementById(item[key])){
        return false;
    }
    return document.getElementById(item[key]).checked;
}
function check_if_obj_in_search_parameters(item){
    add_obj = true;
    for (let k = 0; k < search_parameters.length; k++) {
        search_parameters_key = Object.keys(search_parameters[k])[0];
        search_parameters_value = search_parameters[k][search_parameters_key];

        if(!item[search_parameters_key] || !item[search_parameters_key].includes(search_parameters_value)){
            return false;
        }
    }
    return true;
}





function filter_data(){
    data_valid = []
    for (let i = 0; i < data_from_file.length; i++) {
        item = data_from_file[i]
        if(!check_if_obj_in_search_nazwa_zamierzenia_bud(item)){
            continue;
        }
        if(!check_if_obj_in_search_organs(item)){
            continue;
        }
        if(!check_if_obj_in_search_categories(item)){
            continue;
        }
        if(!check_if_obj_in_search_parameters(item)){
            continue;
        }
        data_valid.push(item);
    }
}

function filter_unique(){
    key = "numer_decyzji_urzedu";
    data_valid_2 = []
    var unique_numer_decyzji_urzedu = {}

    for (let i = 0; i < data_valid.length; i++) {
        var objjj = data_valid[i];

        if(headers_from_file.includes(key)){
            var uniq_data = objjj[key];
        }
        else{
            key1="jednostki_numer";
            key2="nazwisko_projektanta"; // "numer_dzialki";
            var uniq_data = `${objjj[key1]}${objjj[key2]}`;
        }

        if(uniq_data in unique_numer_decyzji_urzedu){
            continue;
        }
        unique_numer_decyzji_urzedu[uniq_data] = 0;
        data_valid_2.push(objjj);
    }
    data_valid = data_valid_2;
}