


function is_year_valid(item){
    key = "data_wplywu_wniosku";
    key2 = "data_wplywu_wniosku_do_urzedu"
    if(headers_from_file.includes(key2)){
        key = key2;
    }
    if(item[key] == ""){
        return false;
    }

    item_year = item[key].split('-')[0];
    if(item_year[0] != "2"){
        return false;
    }

    parent_id = "body_input_year_checkboxes"
    id = `${parent_id}_${item_year}`;
    if(!document.getElementById(id).checked){
        return false;
    }
    return true;
}
function is_state_valid(item){
    key = "wojewodztwo";
    key2 = "wojewodztwo_objekt"
    if(headers_from_file.includes(key2)){
        key = key2;
    }
    item_state = item[key]
    if(item_state == ""){
        return false;
    }
    parent_id = "body_input_organs_checkboxes"
    id = `${parent_id}_${item_state}`;
    if(!document.getElementById(id).checked){
        return false;
    }
    return true;
}

function is_item_valid_for_first_search(item){
    if(!is_year_valid(item)){
        return false;
    }
    return true;
}




document.getElementById('file-input').addEventListener('change', (event) => {
    display_spining_wheel();

    $('#body_input_year_checkboxes').find('input, textarea, button, select').attr('disabled','disabled');
    $('#body_input_organs_checkboxes').find('input, textarea, button, select').attr('disabled','disabled');
    $('#check_all_years').attr('disabled','disabled');
    $('#check_all_states').attr('disabled','disabled');

    checked_checkboxes_years = get_checked_checkboxes_year_checkboxes();

    var startTime = performance.now()
    const reader = new FileReader();
    reader.readAsText(event.target.files[0]);
    reader.onload = (event) => {
        csvData = event.target.result;
        rows = csvData.split('\n');
        
        headers_from_file = rows[0].split('#');

        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].split('#');
            objjj = {}
            for (let j = 0; j < headers_from_file.length; j++) {
                objjj[headers_from_file[j]] = "";
            }
            for (let j = 0; j < cells.length; j++) {
                objjj[headers_from_file[j]] = cells[j];
            }
            if(!is_item_valid_for_first_search(objjj)){
                continue;
            }
            data_from_file.push(objjj);
        }


        var endTime = performance.now()
        console.log(`Read: ${endTime - startTime} milliseconds`)

        sort_data()
        
        var endTime = performance.now()
        console.log(`Read + Sort: ${endTime - startTime} milliseconds`)
        
        document.getElementById("body_container").style.display="block";
        // document.getElementById("body_input").style.display="none";

        display_parameters_checkboxes();

        // display_parameter_checkbox();
        // display_organs_checkboxes();
        // display_category_checkboxes();
        // display_search_parameters_list();
        // display_nazwa_zamierzenia_bud_checkboxes();
        // check_default_checkboxes();
        display_table();
        
        var endTime = performance.now();
        console.log(`Read + Sort + Display: ${endTime - startTime} milliseconds`);

        disable_spining_wheel();
    };
});

function check_default_checkboxes(){
    for (let i = 0; i < checked_nazwa_zamierzenia_bud.length; i++) {
        if (document.getElementById(checked_nazwa_zamierzenia_bud[i])){
            document.getElementById(checked_nazwa_zamierzenia_bud[i]).checked = true;
        }
    }
    for (let i = 0; i < checked_names.length; i++) {
        if (document.getElementById(checked_names[i])){
            document.getElementById(checked_names[i]).checked = true;
        }
    }
    for (let i = 0; i < checked_categories.length; i++) {
        if (document.getElementById(checked_categories[i])){
            document.getElementById(checked_categories[i]).checked = true;
        }
    }
    for (let i = 0; i < checked_organs.length; i++) {
        if (document.getElementById(checked_organs[i])){
            document.getElementById(checked_organs[i]).checked = true;
        }
    }
}
