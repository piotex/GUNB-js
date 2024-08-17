const input = document.getElementById('file-input');

var listtttt = []

input.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
        csvData = event.target.result;
        rows = csvData.split('\n');
        const table = document.createElement('table');

        for (let i = 0; i < rows.length; i++) {
            const row = table.insertRow();
            const cells = rows[i].split('#');

            objjj = {}
            for (let j = 0; j < cells.length; j++) {
                const cell = row.insertCell();
                cell.textContent = cells[j];
                objjj[j] = cells[j];
            }
            listtttt.push(objjj)
        }
        document.body.appendChild(table);
    };

    reader.readAsText(file);

    console.log(listtttt)
});

