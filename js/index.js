

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
                // objjj["data_wplywu_wniosku"] = ;
                listtttt.push(objjj);
            }
            
        }



        sort_data()
        
        if (listtttt.length < max_elem){
            max_elem=listtttt.length;
        }

        display_total();
        display_parameter_checkbox();
        display_organs_checkboxes();
        display_category_checkboxes();
        display_search_parameters_list();
        check_default_checkboxes();
        display_table();
        
        var endTime = performance.now()
        console.log(`Time to display: ${endTime - startTime} milliseconds`)
    };

});


function check_default_checkboxes(){
    for (let i = 0; i < checked_names.length; i++) {
        document.getElementById(checked_names[i]).checked = true;
    }
    for (let i = 0; i < checked_categories.length; i++) {
        document.getElementById(checked_categories[i]).checked = true;
    }
    for (let i = 0; i < checked_organs.length; i++) {
        document.getElementById(checked_organs[i]).checked = true;
    }
}

function max_elem_changed(){
    max_elem = document.getElementById("max_elem").value ;
}