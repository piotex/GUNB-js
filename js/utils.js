






function check_if_obj_in_search_nazwa_zamierzenia_bud(item){
    if(!document.getElementById(item["nazwa_zamierzenia_bud"])){
        return false;
    }
    return document.getElementById(item["nazwa_zamierzenia_bud"]).checked;
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
function add_body_row(body, item){
    keysss = Object.keys(item);
    const row = body.insertRow();
    for (let j = 0; j < keysss.length; j++) {
        key = keysss[j]
        if (!document.getElementById(key).checked) {
            continue;
        }
        row.insertCell().textContent = item[key];
    }
}


function create_table(table_id){
    if (document.contains(document.getElementById(table_id))) {
        document.getElementById(table_id).remove();
    }   

    const table = document.createElement('table');
    table.setAttribute("id", table_id);
    table.classList.add("table");
    table.classList.add("table-striped");
    return table;
}


function delete_search_parameters(idx){
    search_parameters.splice(idx, 1);
    display_search_parameters_list();
};

function insert_search_parameters(){
    keyyy = document.getElementById("insert_search_parameters_key").value;
    valueeee = document.getElementById("insert_search_parameters_value").value;
    search_parameters.push({[keyyy] : valueeee});
    display_search_parameters_list();
};



function check_if_obj_has_correct_data(objjj){
    for (let j = 0; j < headerssss.length; j++) {
        if(objjj[headerssss[j]] == undefined){
            return false
        }
    }
    return true;
}