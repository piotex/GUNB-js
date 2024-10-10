function check_default_generic(data_list, parent_id) {
    for (let i = 0; i < data_list.length; i++) {
        document.getElementById(`${parent_id}_${data_list[i]}`).checked = true;
    }
}





function check_default(){
    check_default_generic(checked_years, "body_input_year_checkboxes");
    check_default_generic(checked_states, "body_input_organs_checkboxes");
}




check_default();