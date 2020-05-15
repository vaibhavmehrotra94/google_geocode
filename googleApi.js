const axios = require("axios");
const g_key = "";

const google_geocoding = address =>
      axios({
         url: `https://maps.googleapis.com/maps/api/geocode/json?address=${address.replace( "#", "")}&region=in&key=${g_key}&components=country:IN`,
         method: "GET"
      });

module.exports = addr => new Promise((resolve, reject) => {
   console.time("geocode_time");


   if (!addr) {
      // console.log("Address nahi mila");
      resolve({error: "Address not found"});
   }

   addr = addr.replace(/-/g, " ")
      .replace(/–/g, " ")
      .replace(/\s{2}/g, "");

   google_geocoding(addr)
      .then(r => {
         if (
            r &&
            r.data &&
            Array.isArray(r.data.results) &&
            r.data.results.length > 0
         )
         //    return Promise.resolve(r);
         // else return Promise.resolve({ msg: "PINCODE" });

         return r;
         else return { msg: "PINCODE" };

      })
      .then(r => {
         if (r.msg && r.msg === "PINCODE") {
            const pincode = addr.match(/\d{6}/);
            if (Array.isArray(pincode) && pincode.length > 0 && pincode[0]) {
               through = "pincode";
               return google_geocoding(pincode[0]);
            } else return Promise.reject({ msg: "No pincode in the input" });
         // } else return Promise.resolve(r);
         } else return r;
      })
      .then(r => {
         console.timeEnd("geocode_time");
         if (r.data && r.data.results && r.data.results.length > 0) {
            // console.log("Geocode =>", r.data.results[0]);
            resolve({
               ...r.data.results[0].geometry.location,
               formatted_address: r.data.results[0].formatted_address
            });
         } else resolve({error:"proper data not found"});
      })
      .catch(e => {
         // console.log("Geocode me error ====>", (e.response || e));
         console.timeEnd("geocode_time");
         resolve({error: e.msg || "No usable response"});
      });
});