function sort_data(){
    key = "data_wplywu_wniosku";
    key2 = "data_wplywu_wniosku_do_urzedu"
    if(headers_from_file.includes(key2)){
        key = key2;
    }
    data_from_file.sort(function(a, b) { 
        return new Date(b[key].substring(0,10)) - new Date(a[key].substring(0,10));
    })
}