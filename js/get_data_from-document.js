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