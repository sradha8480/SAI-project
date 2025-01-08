let data = null;
const KEY = "N49YDN4PP5CFUVPE7TXXE9F6S";
//0. 
//1. N49YDN4PP5CFUVPE7TXXE9F6S
//2. CZ4ULGLJPRG4CQM8M29YKSQ2A

function dectectDistrictIndex(coords) {
  let best_dist = Infinity;
  let best_index = 0;
  for (let i = 0; i < data.length; i++) {
    const dist = Math.abs(coords[0] - data[i][0]) + Math.abs(coords[1] - data[i][1]);
    if (dist < best_dist) {
      best_dist = dist;
      best_index = i;
    }
  }
  return best_index;
}

function selectLoc(loc) {
  loc = loc.split(",");
  for (let i = 0; i < data.length; i++) {
    if (loc[0] == data[i][2] && loc[1] == data[i][3])
      return data[i].slice(2);
  }
  return "Match not Found Error!"
}

export async function GET({ url }) {
  if (!data) {
    data = [];
    let rainfall_dataset = await fetch(url.origin + "/final_rainfall.csv")
    rainfall_dataset = await rainfall_dataset.text();

    for (const lines of rainfall_dataset.split("\n"))
      data.push(lines.split(",").map(x => Number(x) ? Number(x) : x));
  }

  const coords= url.searchParams.get("coords");
  let loc, loc_path;
	if (coords) {
    loc = data[dectectDistrictIndex(coords.split(",").map(Number))]; 
    loc = loc[3] + "," + loc[2];
  } else loc = url.searchParams.get("loc")
  loc_path = "./cache/" + loc + ".json";
  
  /*
  if (existsSync(loc_path)) {
    return new Response(readFileSync(loc_path, "utf-8"), { headers: { "Content-type": "application/json" }})
  } else { 
    */ 
    const d = new Date();
    const time = d.getUTCFullYear() + "-" + d.getUTCMonth() + "-" + d.getUTCDate();
    let res = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${loc}/${time}?key=${KEY}`);
    res = await res.text();
    //writeFileSync(loc_path, res);
    return new Response(res, {
		  headers: {
			  'Content-Type': 'application/json'
		  }
	  });
}