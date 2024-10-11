function check_default_generic(data_list, parent_id) {
    for (let i = 0; i < data_list.length; i++) {
        if(parent_id == ""){
            document.getElementById(`${data_list[i]}`).checked = true;
        }
        if(parent_id != ""){
            document.getElementById(`${parent_id}_${data_list[i]}`).checked = true;
        }
    }
}





function check_default(){
    check_default_generic(checked_years, "body_input_year_checkboxes");
    check_default_generic(checked_states, "body_input_organs_checkboxes");
}

check_default();



function check_all(){
    key = "rodzaj_zam_budowlanego"
    key2 = "nazwa_zamierzenia_bud"
    if(headers_from_file.includes(key2)){
        key = key2;
    }

    check_default_generic(headers_from_file, "");
    check_default_generic(posible_categories, "");

    nazwa_zamierzenia_bud_dict = {}
    for (let i = 0; i < data_from_file.length; i++) {
        elem = data_from_file[i][key];
        elem = elem.replace('"','').trim();
        if (elem == ""){
            continue;
        }
        if(!(elem in nazwa_zamierzenia_bud_dict)){
            nazwa_zamierzenia_bud_dict[elem] = 0
        }
        nazwa_zamierzenia_bud_dict[elem] += 1;
    }
    check_default_generic(Object.keys(nazwa_zamierzenia_bud_dict), "");

    data_list = [];
    for (let idx in Object.keys(posible_organs)) {
        woj = Object.keys(posible_organs)[idx];
        if (document.getElementById(`body_input_organs_checkboxes_${woj}`).checked) {
            for(let idx2 in posible_organs[woj]){
                data_list.push(posible_organs[woj][idx2]);
            }
        }
    }
    check_default_generic(data_list, "");
}