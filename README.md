# Google Geo-code
A quick module to get formatted-address, latitude and longitude from a bunch of addresses provided in a excel file.

## Installation
> **Note:** This assumes that node.js (v12.16.3+) is preinstalled globally in the system.
- In main directory run the below command to install all dependencies.
	> npm i
- Copy your google api key at g_key(line 2) in googleApi.js file.

## Execution
- In the main folder with index.js file run
	> node index.js
- In cli, enter the complete path of the requested file and press Enter.
- Output file can be found in the main folder once the execution is completed.

## Notes
- Geocode has been customized for India.
- In case of any error related to output/data the error is added in the error field of output file.
- Sample input file <file.xlsx> is included in the main folder.
- Returns a <output.xlsx> file with all the fields appended to data provided in that sheet with a additional error column with details of any occurring errors.

## Future Enhancements
- Call multiple geocode promises in one go for faster results. (bluebird package can help).
- Excel code can be optimized a bit and can support multiple worksheets read and write.