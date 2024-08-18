function display_table() {
    const table = create_table("table")

    var header = table.createTHead();
    insert_header(header, listtttt[0])
    var body = table.createTBody();
    insert_body(body)

    document.getElementById("result_table").appendChild(table);
};

function display_parameter_checkbox(){
    const item_in_row = 5
    const table = create_table("table2")
    var keys = Object.keys(listtttt[0]);
    var header = table.createTBody();

    for (let j = 0; j < keys.length/item_in_row; j++) {
        divvv = ''
        const row = header.insertRow();
        for (let k = 0; k < item_in_row; k++) {
            let idx = (j*item_in_row)+k;
            if(idx < keys.length){
                let name = keys[idx]
                labelll = `<label for="${name}">${name}</label>`
                inputtt = `<input type="checkbox" id="${name}" name="${name}" value="${name}" />`
                divvv = `<div style="display: inline-block; min-width: 280px;"> ${inputtt} ${labelll} </div> `
                row.insertCell().outerHTML = `<th>${divvv}</th>`;
            }
        }
    }
    document.getElementById("checkbox_parameters").appendChild(table);
};

function display_search_parameters_list(){
    keyss = Object.keys(listtttt[0])
    keyss = keyss.sort(function(a, b) {
        return a.localeCompare(b)
    });

    const table = create_table("table3")
    var body = table.createTBody();

    for (let i = 0; i < search_parameters.length; i++) { 
        search_parameters_keys = Object.keys(search_parameters[i])[0]
        search_parameters_values = Object.values(search_parameters[i])[0]

        const row = body.insertRow();
        row.insertCell().textContent = search_parameters_keys;
        row.insertCell().textContent = search_parameters_values;
        row.insertCell().outerHTML = `<td><button onclick="delete_search_parameters(${i})" class="btn btn-danger">Usuń filtr</button></td>`;
    }
    const row = body.insertRow();
    select_html = '<select name="insert_search_parameters_key" id="insert_search_parameters_key">'

    for (let j = 0; j < keyss.length; j++) {
        let name = keyss[j]
        select_html += `<option value="${name}">${name}</option>`
    }
    select_html += "</select>"
    row.insertCell().outerHTML = `<td>${select_html}</td>`;
    row.insertCell().outerHTML = `<td><input id="insert_search_parameters_value" placeholder="Wartość filtru..."></td>`;
    row.insertCell().outerHTML = `<td><button onclick="insert_search_parameters()" class="btn btn-primary"> Dodaj filtr </button></td>`;

    document.getElementById("list_parameters").appendChild(table);
};

function display_total(){
    document.getElementById('total_value').innerHTML += `<div>Wczytano z pliku: ${listtttt.length}</div>`;
}


function display_organs_checkboxes(){
    posible_organs = {}
    for (let i = 0; i < listtttt.length; i++) {
        organ_name = listtttt[i]["nazwa_organu"];
        organ_name = organ_name.replace('"','').trim();
        if(!(organ_name in posible_organs)){
            posible_organs[organ_name] = 0
        }
    }

    posible_organs = Object.keys(posible_organs)
    posible_organs = posible_organs.sort(function(a, b) {
        return a.localeCompare(b)
    });

    const item_in_row = 5
    const table = create_table("table4")
    var header = table.createTBody();

    for (let j = 0; j < posible_organs.length/item_in_row; j++) {
        divvv = ''
        const row = header.insertRow();
        for (let k = 0; k < item_in_row; k++) {
            let idx = (j*item_in_row)+k;
            if(idx < posible_organs.length){
                let name = posible_organs[idx];
                labelll = `<label for="${name}">${name}</label>`
                inputtt = `<input type="checkbox" id="${name}" name="${name}" value="${name}" />`
                divvv = `<div style="display: inline-block; min-width: 280px;"> ${inputtt} ${labelll} </div> `
                row.insertCell().outerHTML = `<th>${divvv}</th>`;
            }
        }
    }
    document.getElementById("checkbox_organs").appendChild(table);
};

function display_category_checkboxes(){
    const item_in_row = 5
    const table = create_table("table5")
    var header = table.createTBody();

    for (let j = 0; j < posible_categories.length/item_in_row; j++) {
        divvv = ''
        const row = header.insertRow();
        for (let k = 0; k < item_in_row; k++) {
            let idx = (j*item_in_row)+k;
            if(idx < posible_categories.length){
                let name = posible_categories[idx];
                labelll = `<label for="${name}">${name}</label>`
                inputtt = `<input type="checkbox" id="${name}" name="${name}" value="${name}" />`
                divvv = `<div style="display: inline-block; min-width: 280px;"> ${inputtt} ${labelll} </div> `
                row.insertCell().outerHTML = `<th>${divvv}</th>`;
            }
        }
    }
    document.getElementById("checkbox_categories").appendChild(table);
};