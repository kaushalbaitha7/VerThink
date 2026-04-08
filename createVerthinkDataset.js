const fs = require("fs")

/* ---------- SOFT SKILL WORDS ---------- */

const softSkillWords = [
["adaptability","ability to adjust to new situations"],
["accountability","taking responsibility for actions and results"],
["articulation","expressing ideas clearly"],
["assertiveness","confidently expressing opinions"],
["collaboration","working jointly with others"],
["communication","sharing information effectively"],
["confidence","belief in one's abilities"],
["critical thinking","analyzing problems logically"],
["decision making","choosing the best course of action"],
["empathy","understanding others' feelings"],
["initiative","taking action without being told"],
["leadership","guiding and motivating people"],
["negotiation","reaching agreement through discussion"],
["problem solving","finding solutions to challenges"],
["resilience","ability to recover quickly from setbacks"],
["teamwork","working effectively with others"],
["time management","using time efficiently"],
["work ethic","dedication and discipline toward work"]
]

let softSkillDataset = []

for(let i=0;i<5000;i++){
let base = softSkillWords[i % softSkillWords.length]

softSkillDataset.push({
word: base[0],
meaning: base[1],
category:"soft-skill"
})
}

/* ---------- IT COMMUNICATION WORDS ---------- */

const itWords = [
["agile","iterative software development approach"],
["algorithm","step-by-step procedure to solve a problem"],
["api","interface that allows applications to communicate"],
["backend","server side of an application"],
["bug","error in software code"],
["debugging","process of fixing errors"],
["deployment","releasing software to production"],
["framework","prebuilt structure for development"],
["integration","connecting multiple systems"],
["optimization","improving performance"],
["repository","storage location for code"],
["scalability","ability of system to handle growth"],
["version control","tracking code changes"],
["workflow","sequence of tasks in a process"]
]

let itDataset = itWords.map(x=>({
word:x[0],
meaning:x[1],
category:"IT"
}))

/* ---------- BUSINESS QUOTES ---------- */

const businessQuotes = [
{quote:"Success usually comes to those who are too busy to be looking for it.",author:"Henry David Thoreau"},
{quote:"Your network is your net worth.",author:"Porter Gale"},
{quote:"Leadership is the capacity to translate vision into reality.",author:"Warren Bennis"},
{quote:"Quality means doing it right when no one is looking.",author:"Henry Ford"},
{quote:"Great things in business are never done by one person.",author:"Steve Jobs"}
]

/* ---------- MOTIVATIONAL QUOTES ---------- */

const motivationalQuotes = [
{quote:"The secret of getting ahead is getting started.",author:"Mark Twain"},
{quote:"Believe you can and you're halfway there.",author:"Theodore Roosevelt"},
{quote:"Dream big and dare to fail.",author:"Norman Vaughan"},
{quote:"Do what you can with what you have.",author:"Theodore Roosevelt"},
{quote:"Act as if what you do makes a difference. It does.",author:"William James"}
]

/* ---------- WRITE FILES ---------- */

fs.writeFileSync("softskills_words.json",JSON.stringify(softSkillDataset,null,2))
fs.writeFileSync("it_words.json",JSON.stringify(itDataset,null,2))
fs.writeFileSync("business_quotes.json",JSON.stringify(businessQuotes,null,2))
fs.writeFileSync("motivation_quotes.json",JSON.stringify(motivationalQuotes,null,2))

console.log("Datasets created successfully")