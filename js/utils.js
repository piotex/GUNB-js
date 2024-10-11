








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



