var listtttt = []
var search_parameters = [{"data_wplywu_wniosku":"2016-05"},{"kategoria":"I"}]




document.getElementById('file-input').addEventListener('change', (event) => {
    const reader = new FileReader();
    reader.readAsText(event.target.files[0]);
    reader.onload = (event) => {
        csvData = event.target.result;
        rows = csvData.split('\n');
        
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].split('#');
            objjj = {}
            for (let j = 0; j < cells.length; j++) {
                objjj[j] = cells[j];
            }
            listtttt.push(objjj)
        }

        display_parameter_checkbox()
        checked_by_default()
        display_search_parameters_list()
    };

});


function display_table() {
    var startTime = performance.now()
    var max_elem = 100;
    if (listtttt.length < max_elem){
        max_elem=listtttt.length;
    }

    if (document.contains(document.getElementById("table"))) {
        document.getElementById("table").remove();
    }   
    const table = document.createElement('table');
    table.setAttribute("id", "table");
    table.classList.add("table");
    table.classList.add("table-striped");

    var header = table.createTHead();
    insert_header(header, listtttt[0])
    var body = table.createTBody();
    insert_body(body, max_elem)

    document.getElementById("result_table").appendChild(table);
    var endTime = performance.now()
    console.log(`Time to display: ${endTime - startTime} milliseconds`)
};

function delete_search_parameters(idx){
    search_parameters.splice(idx, 1);
    display_search_parameters_list();
}

function display_search_parameters_list(){
    if (document.contains(document.getElementById("table3"))) {
        document.getElementById("table3").remove();
    }   

    const table = document.createElement('table');
    table.setAttribute("id", "table3");
    table.classList.add("table");
    table.classList.add("table-striped");
    var body = table.createTBody();

    for (let i = 0; i < search_parameters.length; i++) { 
        search_parameters_keys = Object.keys(search_parameters[i])
        search_parameters_values = Object.values(search_parameters[i])

        const row = body.insertRow();
        row.insertCell().textContent = search_parameters_keys[0];
        row.insertCell().textContent = search_parameters_values[0];
        row.insertCell().outerHTML = `<td><button onclick="delete_search_parameters(${i})" class="btn btn-danger">Usuń filtr</button></td>`;
    }
    const row = body.insertRow();
    select_html = '<select name="insert_search_parameters_key" id="insert_search_parameters_key">'
    for (let j = 0; j < Object.keys(listtttt[0]).length; j++) {
        select_html += `<option value="${listtttt[0][j]}">${listtttt[0][j]}</option>`
    }
    select_html += "</select>"
    row.insertCell().outerHTML = `<td>${select_html}</td>`;
    row.insertCell().outerHTML = `<td><input id="insert_search_parameters_value" placeholder="Wartość filtru..."></td>`;
    row.insertCell().outerHTML = `<td><button onclick="insert_search_parameters()" class="btn btn-primary"> Dodaj filtr </button></td>`;

    document.getElementById("list_parameters").appendChild(table);
}


function insert_search_parameters(){
    keyyy = document.getElementById("insert_search_parameters_key").value;
    valueeee = document.getElementById("insert_search_parameters_value").value;
    search_parameters.push({[keyyy] : valueeee});
    display_search_parameters_list();
}