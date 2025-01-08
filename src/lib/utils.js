export async function loadKeywords() {
    let res = await fetch(encodeLan("/keywords.txt"));
    res = await res.text();
    res = res.split("\n").map(x => x.trim());
    res.unshift("lol");
    return res;
}

export function encodeLan(str) {
    const lan = localStorage.getItem("lan");
    if (lan) return "/" + lan + str;

    localStorage.setItem("lan", "English");
    return "/English" + str;
}