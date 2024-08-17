
function insert_header(header, values){
    const row = header.insertRow();
    for (let j = 0; j < Object.keys(values).length; j++) {
        if (document.getElementById(values[j]).checked) {
            row.insertCell().outerHTML = `<th>${values[j]}</th>`;
        }
    }
}
function insert_body(body, max_elem){
    for (let i = 1; i < max_elem; i++) {
        const row = body.insertRow();
        for (let j = 0; j < Object.keys(listtttt[i]).length; j++) {
            if (document.getElementById(listtttt[0][j]).checked) {
                row.insertCell().textContent = listtttt[i][j];
            }
        }
    }
}
function display_parameter_checkbox(){
    const item_in_row = 5

    if (document.contains(document.getElementById("table2"))) {
        document.getElementById("table2").remove();
    }   

    const table = document.createElement('table');
    table.setAttribute("id", "table2");
    table.classList.add("table");
    table.classList.add("table-striped");
    var header = table.createTBody();

    document.getElementById('parameters').innerHTML += `<div>Total: ${listtttt.length}</div>`;
    for (let j = 0; j < Object.keys(listtttt[0]).length/item_in_row; j++) {
        divvv = ''
        const row = header.insertRow();
        for (let k = 0; k < item_in_row; k++) {
            let idx = (j*item_in_row)+k;
            let name = listtttt[0][idx]
            labelll = `<label for="${name}">${name}</label>`
            inputtt = `<input type="checkbox" id="${name}" name="${name}" value="${name}" />`
            divvv = `<div style="display: inline-block; min-width: 280px;"> ${inputtt} ${labelll} </div> `
            row.insertCell().outerHTML = `<th>${divvv}</th>`;
        }
    }
    document.getElementById("checkbox_parameters").appendChild(table);
}
function checked_by_default(){
    checked_names = ["nazwa_inwestor","data_wplywu_wniosku","nazwa_zamierzenia_bud","kategoria", "nazwa_organu"]
    for (let i = 0; i < checked_names.length; i++) {
        document.getElementById(checked_names[i]).checked = true;
    }
}

