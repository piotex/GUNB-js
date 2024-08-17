var listtttt = []
var search_parameters = [{"data_wplywu_wniosku":"24-08"},{"nazwa_zam_budowlanego":"budynków"}]
var checked_names = ["nazwa_inwestor","data_wplywu_wniosku","nazwa_zam_budowlanego","kategoria", "nazwa_organu"]
var checked_organs = []

var max_elem = 1000;
var posible_organs = {}



document.getElementById('file-input').addEventListener('change', (event) => {
    var startTime = performance.now()

    const reader = new FileReader();
    reader.readAsText(event.target.files[0]);
    reader.onload = (event) => {
        csvData = event.target.result;
        rows = csvData.split('\n');
        
        headerssss = rows[0].split('#');
        
        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].split('#');
            objjj = {}
            for (let j = 0; j < cells.length; j++) {
                objjj[headerssss[j]] = cells[j];
            }

            if(check_if_obj_has_correct_data(objjj)){
                listtttt.push(objjj);
            }
        }



        sort_data()
        
        if (listtttt.length < max_elem){
            max_elem=listtttt.length;
        }

        display_total();
        display_parameter_checkbox();
        check_default_checkboxes();
        display_organs_checkboxes();
        display_category_checkboxes();
        display_search_parameters_list();
        display_table();
        
        var endTime = performance.now()
        console.log(`Time to display: ${endTime - startTime} milliseconds`)
    };

});

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
    return 1;
    posible_organs = {}
    for (let i = 0; i < listtttt.length; i++) {
        organ_name = listtttt[i]["kategoria"];
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
    document.getElementById("checkbox_categories").appendChild(table);
};