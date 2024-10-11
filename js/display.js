

function insert_header(header){
    const row = header.insertRow();

    idx_showed_column = 0;
    for (let j = 0; j < headers_from_file.length; j++) {
        key = headers_from_file[j];
        if (document.getElementById(key).checked) {
            row.insertCell().outerHTML = `<th onclick="sortTable(${idx_showed_column})" >${key}</th>`;
            idx_showed_column += 1;
        }
    }
}
function add_body_row(body, item){
    // keysss = Object.keys(item);
    const row = body.insertRow();
    for (let j = 0; j < headers_from_file.length; j++) {
        key = headers_from_file[j];
        if (!document.getElementById(key).checked) {
            continue;
        }
        row.insertCell().textContent = item[key];
    }
    // for (let j = 0; j < keysss.length; j++) {
    //     key = keysss[j]
    //     if (!document.getElementById(key).checked) {
    //         continue;
    //     }
    //     row.insertCell().textContent = item[key];
    // }
}
function insert_body(body){
    displayed_elem_counter = 0;
    max_elem = document.getElementById("max_elem").value;
    for (let i = 0; i < data_valid.length; i++) {
        item = data_valid[i]

        add_body_row(body, item)
        
        displayed_elem_counter += 1;
        if(displayed_elem_counter > max_elem){
            break;
        }
    }
}





function display_table() {
    filter_data();
    const table = create_table("table")

    var header = table.createTHead();
    insert_header(header);
    var body = table.createTBody();
    insert_body(body);

    document.getElementById("result_table").appendChild(table);

    display_total(data_valid.length, "");
};

function display_unique_table() {
    filter_data();
    filter_unique();
    const table = create_table("table")

    var header = table.createTHead();
    insert_header(header, headers_from_file);
    var body = table.createTBody();
    insert_body(body);

    document.getElementById("result_table").appendChild(table);

    display_total(data_valid.length, "(unikalne)");
};




function display_total(total, comment){
    document.getElementById('total_value').innerHTML = `<div>Liczba elementów spełniających wszystkie filtry: ${total} ${comment}<br/>Liczba elementów spełniających filtry zdefiniowane podczas wczytywania pliku: ${data_from_file.length}</div>`;
}






