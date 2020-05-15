const prompt = require('prompt'),
	XLSX = require("xlsx");

const geocode = require("./googleApi.js");

const get_filepath = () => new Promise((resolve, reject) => {
	prompt.start();

	prompt.get(['Complete File Path'], function (err, result) {
	    if (err) { reject(err) }
	    	resolve(result['Complete File Path'])
	});
});

const addSheetToWorkbook = (wb, sheetName, sheetData) => {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sheetData, {
        header: Object.keys(sheetData[0])
    }), sheetName);
    
    let sheet = wb.Sheets[sheetName],
    	wscols = Object.keys(sheetData[0]).map(i => ({ wch: Math.max(...sheetData.map(j => j[i] ? Math.max(String(j[i]).length, String(i).length) : String(i).length)) }));

    sheet['!cols'] = wscols;
}


get_filepath()
.then(async r=>{

	const workbook = XLSX.readFile(r,{ type: "binary", cellDates: true }),
		wb = XLSX.utils.book_new(),
		first_sheet_name = workbook.SheetNames[0],
		worksheet = workbook.Sheets[first_sheet_name];
		
	let data = XLSX.utils.sheet_to_json(worksheet),
		data_length = 0;
	// console.log(data);

	// data = data.filter((k, index)=> {
	// 	// filtered data can be written into a different object which can help download invalid rows in a seperate file.
	// 	return k.address
	// });

	data_length = data.length;
	
	if(!data_length){
		return Promise.reject("Proper Data not found in first sheet of workbook provided");
	}

	for(let i=0; i<data.length; i++){
		console.log(`Processing Row ${i+1}`);
		if(!data[i].address){
			// Filtered data can be handled here
			data[i] = {
				...data[i],
				error: "address field not found"
			}
			continue;
		}
		let temp = await geocode(data[i].address)
		data[i] = {
			...data[i],
			...temp
		}
	}

	// data.forEach(k=>console.log(k));
	// console.log("calc done");

   	addSheetToWorkbook(wb, first_sheet_name, data)
    return XLSX.writeFile(wb, `output.xlsx`);
})
.then(r=>{
	console.log("A new file has been created with name <output.xlsx> in the folder where the script was run");
	process.exit(1);
})
.catch(err=>{
	console.error("ERROR: ",err);
})