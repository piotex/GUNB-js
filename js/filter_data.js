


function check_if_obj_in_search_nazwa_zamierzenia_bud(item){
    key = "rodzaj_zam_budowlanego"
    key2 = "nazwa_zamierzenia_bud"
    if(headers_from_file.includes(key2)){
        key = key2;
    }
    if(!document.getElementById(item[key])){
        return false;
    }
    return document.getElementById(item[key]).checked;
}
function check_if_obj_in_search_organs(item){
    if(!document.getElementById(item["nazwa_organu"])){
        return false;
    }
    return document.getElementById(item["nazwa_organu"]).checked;
}
function check_if_obj_in_search_categories(item){
    if(!document.getElementById(item["kategoria"])){
        return false;
    }
    return document.getElementById(item["kategoria"]).checked;
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
    }
}