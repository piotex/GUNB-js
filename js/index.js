




function get_checked_checkboxes_year_checkboxes(){
    checked_checkboxes_years = []
    for (let i = 0; i < checkboxes_years.length; i++) {
        var checkboxes_years_i = checkboxes_years[i];
        if (document.getElementById(`body_input_year_checkboxes_${checkboxes_years_i}`).checked) {
            checked_checkboxes_years.push(checkboxes_years_i)
        }
    }
    return checked_checkboxes_years;
}


document.getElementById('file-input').addEventListener('change', (event) => {
    checked_checkboxes_years = get_checked_checkboxes_year_checkboxes();

    document.getElementById("body_input_input").style.display="none";
    document.getElementById("body_input_loader").style.display="block";


    
    var startTime = performance.now()

    const reader = new FileReader();
    reader.readAsText(event.target.files[0]);
    reader.onload = (event) => {
        csvData = event.target.result;
        rows = csvData.split('\n');
        
        headerssss = rows[0].split('#');

        var unique_numer_decyzji_urzedu = {}
        
        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].split('#');
            if(!cells[3]){
                continue;
            }
            if(cells[3][0] != "2"){
                continue;
            }
            if (!checked_checkboxes_years.includes(cells[3].substring(0, 4))) {
                continue;
            }

            objjj = {}
            for (let j = 0; j < cells.length; j++) {
                objjj[headerssss[j]] = cells[j];
            }

            parts = objjj["data_wplywu_wniosku"].toString().split(' ')[0].split('-');
            // objjj["data_wplywu_wniosku"] = new Date(parts[0], parts[1] - 1, parts[2]); 


            if(objjj["numer_decyzji_urzedu"] == ""){
                continue;
            }
            if(objjj["nazwa_zamierzenia_bud"] == ""){
                continue;
            }
            if(objjj["nazwa_organu"] == ""){
                continue;
            }
            if(objjj["kategoria"] == ""){
                continue;
            }
            if(objjj["numer_decyzji_urzedu"] in unique_numer_decyzji_urzedu){
                continue;
            }
            if(!check_if_obj_has_correct_data(objjj)){
                continue;
            }
            unique_numer_decyzji_urzedu[objjj["numer_decyzji_urzedu"]] = 0;

            listtttt.push(objjj);

        }

        var endTime = performance.now()
        console.log(`Read: ${endTime - startTime} milliseconds`)

        sort_data()
        
        var endTime = performance.now()
        console.log(`Read + Sort: ${endTime - startTime} milliseconds`)
        
        document.getElementById("body_container").style.display="block";
        document.getElementById("body_input").style.display="none";
        display_parameter_checkbox();
        display_organs_checkboxes();
        display_category_checkboxes();
        display_search_parameters_list();
        display_nazwa_zamierzenia_bud_checkboxes();
        check_default_checkboxes();
        display_table();
        
        var endTime = performance.now()
        console.log(`Read + Sort + Display: ${endTime - startTime} milliseconds`)
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
