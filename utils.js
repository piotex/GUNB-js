
function insert_header(header, item){
    const row = header.insertRow();
    keysss = Object.keys(item);
    for (let j = 0; j < keysss.length; j++) {
        key = keysss[j];
        if (document.getElementById(key).checked) {
            row.insertCell().outerHTML = `<th>${key}</th>`;
        }
    }
}
function insert_body(body){
    displayed_elem_counter = 0
    for (let i = 0; i < listtttt.length; i++) {
        item = listtttt[i]
        if(!check_if_obj_in_search_parameters(item)){
            continue;
        }
        add_body_row(body, item)
        
        displayed_elem_counter += 1;
        if(displayed_elem_counter > max_elem){
            break;
        }
    }
}

function check_default_checkboxes(){
    for (let i = 0; i < checked_names.length; i++) {
        document.getElementById(checked_names[i]).checked = true;
    }
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

function sort_data(){
    listtttt.sort(function(a, b) { 
        return b["data_wplywu_wniosku"].substring(0,4) - a["data_wplywu_wniosku"].substring(0,4);
    })
}

function check_if_obj_has_correct_data(objjj){
    if(objjj["data_wplywu_wniosku"] == undefined  || "2" != objjj["data_wplywu_wniosku"][0]){
        return false;
    }
    for (let j = 0; j < headerssss.length; j++) {
        if(objjj[headerssss[j]] == undefined){
            return false
        }
    }
    return true;
}