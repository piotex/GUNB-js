







document.getElementById('file-input').addEventListener('change', (event) => {
    display_spining_wheel();

    checked_checkboxes_years = get_checked_checkboxes_year_checkboxes();

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
            for (let j = 0; j < headerssss.length; j++) {
                objjj[headerssss[j]] = "";
            }
            for (let j = 0; j < cells.length; j++) {
                objjj[headerssss[j]] = cells[j];
            }

            // if(!cells[3]){
            //     continue;
            // }
            // if(cells[3][0] != "2"){
            //     continue;
            // }
            // if (!checked_checkboxes_years.includes(cells[3].substring(0, 4))) {
            //     continue;
            // }
            // if(objjj["numer_decyzji_urzedu"] == ""){
            //     continue;
            // }
            // if(objjj["nazwa_zamierzenia_bud"] == ""){
            //     continue;
            // }
            // if(objjj["nazwa_organu"] == ""){
            //     continue;
            // }
            // if(objjj["kategoria"] == ""){
            //     continue;
            // }
            // if(!check_if_obj_has_correct_data(objjj)){
            //     continue;
            // }

            listtttt.push(objjj);
        }
        // var unique_numer_decyzji_urzedu = {}
        // unique_numer_decyzji_urzedu[objjj["numer_decyzji_urzedu"]] = 0;
        // if(objjj["numer_decyzji_urzedu"] in unique_numer_decyzji_urzedu){
        //     continue;
        // }



        var endTime = performance.now()
        console.log(`Read: ${endTime - startTime} milliseconds`)

        sort_data()
        
        var endTime = performance.now()
        console.log(`Read + Sort: ${endTime - startTime} milliseconds`)
        
        document.getElementById("body_container").style.display="block";
        document.getElementById("body_input").style.display="none";

        display_parameters_checkboxes();
        // display_parameter_checkbox();
        // display_organs_checkboxes();
        // display_category_checkboxes();
        // display_search_parameters_list();
        // display_nazwa_zamierzenia_bud_checkboxes();
        // check_default_checkboxes();
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
