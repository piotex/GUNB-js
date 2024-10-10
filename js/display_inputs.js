function display_body_input_generic_checkboxes(data_list, parent_id) {
    for (let i = 0; i < data_list.length; i++) {
        var data_elem = data_list[i];
        const div = document.createElement('div');
        div.className = 'body_input_checkboxes_checkbox';
        div.innerHTML = `
        <div style="display: inline-block; min-width: 280px;"> 
        <input type="checkbox" id="${parent_id}_${data_elem}"  > 
        <label for="${parent_id}_${data_elem}">${data_elem}</label> 
        </div>
        `;
        document.getElementById(parent_id).appendChild(div);

    }
}
function display_parameters_generic_checkboxes(table_name, data_list, parent_id){
    const item_in_row = 5
    const table = create_table(table_name);
    var header = table.createTBody();

    for (let j = 0; j < data_list.length/item_in_row; j++) {
        divvv = ''
        const row = header.insertRow();
        for (let k = 0; k < item_in_row; k++) {
            let idx = (j*item_in_row)+k;
            if(idx < data_list.length){
                let name = data_list[idx];
                labelll = `<label for="${name}">${name}</label>`
                inputtt = `<input type="checkbox" id="${name}" name="${name}" value="${name}" />`
                divvv = `<div style="display: inline-block; min-width: 280px;"> ${inputtt} ${labelll} </div> `
                row.insertCell().outerHTML = `<th>${divvv}</th>`;
            }
        }
    }
    document.getElementById(parent_id).appendChild(table);
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

function display_parameters_checkboxes(){
    display_parameters_generic_checkboxes("table2", Object.keys(listtttt[0]), "checkbox_parameters");

    display_parameters_generic_checkboxes("table5", posible_categories, "checkbox_categories");

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
    display_parameters_generic_checkboxes("table6", Object.keys(nazwa_zamierzenia_bud_dict), "checkbox_nazwa_zamierzenia_bud");

    data_list = [];
    for (let idx in Object.keys(posible_organs)) {
        woj = Object.keys(posible_organs)[idx];
        if (document.getElementById(`body_input_organs_checkboxes_${woj}`).checked) {
            for(let idx2 in posible_organs[woj]){
                data_list.push(posible_organs[woj][idx2]);
            }
        }
    }
    display_parameters_generic_checkboxes("table4", data_list, "checkbox_organs");



    display_search_parameters_list();
};





















display_body_input_generic_checkboxes(checkboxes_years, "body_input_year_checkboxes");
display_body_input_generic_checkboxes(Object.keys(posible_organs), "body_input_organs_checkboxes");

// display_body_input_year_checkboxes();
// display_body_input_wojewodztwo_checkboxes();
