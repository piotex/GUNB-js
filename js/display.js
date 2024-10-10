

function insert_header(header, item){
    const row = header.insertRow();
    keysss = Object.keys(item);
    idx_showed_column = 0;
    for (let j = 0; j < keysss.length; j++) {
        key = keysss[j];
        if (document.getElementById(key).checked) {
            row.insertCell().outerHTML = `<th onclick="sortTable(${idx_showed_column})" >${key}</th>`;
            idx_showed_column += 1;
        }
    }
}
function insert_body(body){
    displayed_elem_counter = 0;
    max_elem = document.getElementById("max_elem").value;
    for (let i = 0; i < listtttt.length; i++) {
        item = listtttt[i]
        // if(!check_if_obj_in_search_parameters(item)){
        //     continue;
        // }
        // if(!check_if_obj_in_search_organs(item)){
        //     continue;
        // }
        // if(!check_if_obj_in_search_nazwa_zamierzenia_bud(item)){
        //     continue;
        // }
        // if(!check_if_obj_in_search_categories(item)){
        //     continue;
        // }
        add_body_row(body, item)
        
        displayed_elem_counter += 1;
        if(displayed_elem_counter > max_elem){
            break;
        }
    }
}





function display_table() {
    const table = create_table("table")

    var header = table.createTHead();
    insert_header(header, listtttt[0])
    var body = table.createTBody();
    insert_body(body)

    document.getElementById("result_table").appendChild(table);

    display_total();
};





function display_total(){
    total = 0;
    for (let i = 0; i < listtttt.length; i++) {
        item = listtttt[i]
        // if(!check_if_obj_in_search_parameters(item)){
        //     continue;
        // }
        // if(!check_if_obj_in_search_nazwa_zamierzenia_bud(item)){
        //     continue;
        // }
        // if(!check_if_obj_in_search_categories(item)){
        //     continue;
        // }
        // if(!check_if_obj_in_search_organs(item)){
        //     continue;
        // }
        total += 1;
    }
    document.getElementById('total_value').innerHTML = `<div>Liczba elementów spełniających filtry: ${total} <br/>Liczba elementy w pliku: ${listtttt.length}</div>`;
}






