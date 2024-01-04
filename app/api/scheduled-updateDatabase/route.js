const https = require("https");
// const fetch = require("node-fetch");
const Papa = require("papaparse");
const { MongoClient } = require("mongodb");

const packageId = "da46e4ac-d4ab-4b1c-b139-6362a0a43b3c";

let dropInUrl = "";
let csvText = "";
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const getPackage = new Promise((resolve, reject) => {
  https.get(`https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_show?id=${packageId}`, (response) => {
    let dataChunks = [];
    response
      .on("data", (chunk) => {
        dataChunks.push(chunk);
      })
      .on("end", () => {
        let data = Buffer.concat(dataChunks);
        resolve(JSON.parse(data.toString())["result"]);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
});

export async function GET(req) {
  try {
    // connect mongoDB
    await client.connect();

    // get data url
    await getPackage
      .then((pkg) => {
        // this is the metadata of the package
        const dropInResource = pkg.resources.find((resource) => resource.name === "Drop-in.csv");
        if (dropInResource) {
          dropInUrl = dropInResource.url;
        }
      })
      .catch((error) => {
        console.error(error);
      });

    if (dropInUrl) {
      const csvResponse = await fetch(dropInUrl, { cache: "no-store" });
      csvText = await csvResponse.text();

      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        complete: async function (results) {
          try {
            const database = client.db("recreation_toronto");
            database.collection("dropinprograms").drop();
            console.log(database, uri);

            const newCollection = database.collection("dropinprograms");
            await newCollection.insertMany(results.data);
            csvText = uri;

            return new Response(JSON.stringify(results.data), { status: 200 });
          } catch (error) {
            console.log(error);
            return new Response(error, { status: 500 });
          } finally {
            await client.close();
          }
        },
      });
    }
  } catch (error) {
    console.log(error);
    return new Response(error, { status: 500 });
  }

  return new Response(JSON.stringify(csvText), { status: 200 });
}
