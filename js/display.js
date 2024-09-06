function display_body_input_year_checkboxes() {
    for (let i = 0; i < checkboxes_years.length; i++) {
        var checkboxes_years_i = checkboxes_years[i];
        const div = document.createElement('div');
        div.className = 'body_input_checkboxes_checkbox';
        div.innerHTML = `
        <div style="display: inline-block; min-width: 280px;"> 
        <input type="checkbox" id="body_input_year_checkboxes_${checkboxes_years_i}"  > 
        <label for="body_input_year_checkboxes_${checkboxes_years_i}">${checkboxes_years_i}</label> 
        </div>
        `;
        document.getElementById('body_input_year_checkboxes').appendChild(div);
    }
    document.getElementById(`body_input_year_checkboxes_${new Date().getFullYear()}`).checked = true;
}
display_body_input_year_checkboxes();



function display_body_input_wojewodztwo_checkboxes() {
    for (let k in posible_organs) {
        var checkboxes_years_i = k;
        const div = document.createElement('div');
        div.className = 'body_input_checkboxes_checkbox';
        div.innerHTML = `
        <div style="display: inline-block; min-width: 280px;"> 
        <input type="checkbox" id="body_input_wojewodztwo_checkboxes_${checkboxes_years_i}"  > 
        <label for="body_input_wojewodztwo_checkboxes_${checkboxes_years_i}">${checkboxes_years_i}</label> 
        </div>
        `;
        document.getElementById('body_input_organs_checkboxes').appendChild(div);
    }

    for (let i = 0; i < checked_wojewodztwo.length; i++) {
        document.getElementById(`body_input_wojewodztwo_checkboxes_${checked_wojewodztwo[i]}`).checked = true;
    }
}
display_body_input_wojewodztwo_checkboxes();



function display_table() {
    const table = create_table("table")

    var header = table.createTHead();
    insert_header(header, listtttt[0])
    var body = table.createTBody();
    insert_body(body)

    document.getElementById("result_table").appendChild(table);

    display_total();
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
    total = 0;
    for (let i = 0; i < listtttt.length; i++) {
        item = listtttt[i]
        if(!check_if_obj_in_search_parameters(item)){
            continue;
        }
        if(!check_if_obj_in_search_nazwa_zamierzenia_bud(item)){
            continue;
        }
        if(!check_if_obj_in_search_categories(item)){
            continue;
        }
        if(!check_if_obj_in_search_organs(item)){
            continue;
        }
        total += 1;
    }
    document.getElementById('total_value').innerHTML = `<div>Liczba elementów spełniających filtry: ${total} <br/>Liczba elementy w pliku: ${listtttt.length}</div>`;
}


function display_organs_checkboxes(){
    checked_woj = []
    for (let k in posible_organs) {
        if (document.getElementById(`body_input_wojewodztwo_checkboxes_${k}`).checked) {
            checked_woj.push(k);
        }
    }

    const item_in_row = 5
    const table = create_table("table4")
    var header = table.createTBody();

    for (let i = 0; i < checked_woj.length; i++) {
        organs = posible_organs[checked_woj[i]]
        for (let j = 0; j < organs.length/item_in_row; j++) {
            divvv = ''
            const row = header.insertRow();
            for (let k = 0; k < item_in_row; k++) {
                let idx = (j*item_in_row)+k;
                if(idx < organs.length){
                    let name = organs[idx];
                    labelll = `<label for="${name}">${name}</label>`
                    inputtt = `<input type="checkbox" id="${name}" name="${name}" value="${name}" />`
                    divvv = `<div style="display: inline-block; min-width: 280px;"> ${inputtt} ${labelll} </div> `
                    row.insertCell().outerHTML = `<th>${divvv}</th>`;
                }
            }
        }
    }

    document.getElementById("checkbox_organs").appendChild(table);
};


function display_nazwa_zamierzenia_bud_checkboxes(){
    nazwa_zamierzenia_bud_dict = {}
    for (let i = 0; i < listtttt.length; i++) {
        elem = listtttt[i]["nazwa_zamierzenia_bud"];
        elem = elem.replace('"','').trim();
        if (elem == ""){
            continue;
        }
        if(!(elem in nazwa_zamierzenia_bud_dict)){
            nazwa_zamierzenia_bud_dict[elem] = 0
        }
        nazwa_zamierzenia_bud_dict[elem] += 1;
    }
    nazwa_zamierzenia_bud_dict = Object.keys(nazwa_zamierzenia_bud_dict)
    // posible_organs = posible_organs.sort(function(a, b) {
    //     return a.localeCompare(b)
    // });

    const item_in_row = 5
    const table = create_table("table6")
    var header = table.createTBody();

    for (let j = 0; j < nazwa_zamierzenia_bud_dict.length/item_in_row; j++) {
        divvv = ''
        const row = header.insertRow();
        for (let k = 0; k < item_in_row; k++) {
            let idx = (j*item_in_row)+k;
            if(idx < nazwa_zamierzenia_bud_dict.length){
                let name = nazwa_zamierzenia_bud_dict[idx];
                labelll = `<label for="${name}">${name}</label>`
                inputtt = `<input type="checkbox" id="${name}" name="${name}" value="${name}" />`
                divvv = `<div style="display: inline-block; min-width: 280px;"> ${inputtt} ${labelll} </div> `
                row.insertCell().outerHTML = `<th>${divvv}</th>`;
            }
        }
    }
    document.getElementById("checkbox_nazwa_zamierzenia_bud").appendChild(table);
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