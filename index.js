//Requiring the modules -> It should always be done on the top
const express = require('express')
const ejs = require('ejs') //View Engine
const path = require('path')

//Creating our server
const app = express()

app.use(express.json())

//Setting Up EJS

app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, '/public')))

const PORT = process.env.PORT || 3000

// GET, POST, PATCH, DELETE

//@GET /
//description: GET request to home page
app.get('/', (req, res) => {
  res.render('index')
})

app.get('/search', (req, res) => {
  const query = req.query

  const question = query.question

  //TF-IDF ALgo

const lin = require('line-reader')
var fs = require('fs')


var keywords = fs.readFileSync('keywords.txt').toString().replace(/\r\n/g,'\n').split('\n')

var idf = fs.readFileSync('idf.txt').toString().replace(/\r\n/g,'\n').split('\n')
idf = idf.map(Number)

var mag = fs.readFileSync('Magnitude.txt').toString().replace(/\r\n/g,'\n').split('\n')
mag = mag.map(Number)

var tf = fs.readFileSync('tfidf.txt').toString().replace(/\r\n/g,'\n').split('\n')


const rows=1894
const cols=keywords.length

var tfidf=[];

for(let i=0;i<rows;i++)
{
  var arrr=[]
  for (let j = 0; j < cols; j++) {
    arrr[j] = 0
  }
  tfidf[i]=arrr;
}
arrr=[]
for(var s=0;s<tf.length;s++)
{
  tf[s]=tf[s].toLowerCase()
  arrr = tf[s].split(' ')
  let i = parseInt(arrr[0])
  let j = parseInt(arrr[1])
  let k = parseFloat(arrr[2])
  tfidf[i-1][j-1]=k;
}
query_str = question

stopwords=['don', "isn't", 'm', "hadn't", 'hers', 'above', "couldn't", 't', "shan't", 'y', 'here', "wouldn't", 'themselves', 'herself', 'all', 'then', 'if', 'only', 'our', 'now', 'has', 'won', "needn't", 'himself', 'from', 'you', 'her', 'of', 'there', 'your', 'll', 'we', 'are', 'at', 'wasn', 'on', "weren't", 'once', 'my', 'shouldn', 'because', 'into', 'than', 'ours', 'weren', 'his', "haven't", 'before', 'off', 'between', 'them', "shouldn't", 'nor', "you'd", 'after', "that'll", 'over', 'i', 'what', 're', 'haven', 'am', 'under', "doesn't", 'were', 'not', "hasn't", 've', 'why', 'against', 'most', 'but', 'in', 'didn', 'below', 'doesn', 'him', 's', 'its', 'too', 'down', 'further', 'again', 'those', 'be', "she's", "didn't", 'a', 'same', 'myself', 'it', 'was', 'been', 'each', 'some', 'does', 'during', 'had', 'wouldn', 'this', "don't", "wasn't", "you've", "it's", 'when', 'itself', 'more', 'such', 'that', 'up', 'yourselves', 'both', 'mustn', 'she', 'for', 'whom', 'an', 'while', 'needn', 'can', 'aren', 'very', 'isn', 'mightn', 'few', 'is', 'through', 'yours', "mightn't", 'couldn', 'who', 'being', 'any', 'until', 'will', 'ain', "won't", 'hadn', 'with', 'as', 'hasn', 'or', 'about', 'how', 'just', 'other', 'having', 'should', 'to', 'have', 'these', 'o', 'so', 'theirs', 'out', 'they', 'their', 'no', 'own', 'where', "you'll", 'he', 'did', 'which', "aren't", 'ma', 'by', "you're", 'the', 'do', 'and', 'd', 'yourself', 'me', "should've", "mustn't", 'doing', 'ourselves', 'shan','\n','\\n',',']

function remove_stopwords(str) {
  ress = []
  words = str.split(' ')
  for (i = 0; i < words.length; i++) {
    word_clean = words[i].split('.').join('')
    if (!stopwords.includes(word_clean)) {
      ress.push(word_clean)
    }
  }
  return ress.join(' ')
} 
query_str = remove_stopwords(query_str)
var keyall_str=[]
keyall_str = query_str.split(' ')
tfidf_str=[]

for(let i=0;i<keywords.length;i++)
{
  tfidf_str[i]=0;
  for(j=0;j<keyall_str.length;j++)
  {
    if(keywords[i]==keyall_str[j])
      tfidf_str[i]+=idf[i];
  }
  tfidf_str[i] = tfidf_str[i]/keyall_str.length
}
mag_tfidf_str=0.0
for(i=0;i<tfidf_str.length;i++)
{
  mag_tfidf_str += tfidf_str[i] * tfidf_str[i];
}
mag_tfidf_str = Math.sqrt(mag_tfidf_str)
sim=[]
for(let i=0;i<rows;i++)
{
  simi=0;
  for(let j=0;j<keywords.length;j++)
  {
    simi=simi+tfidf[i][j]*tfidf_str[j];
  }
  simi = simi / (mag_tfidf_str*mag[i])
  
  sim.push(simi)
}
//console.log(sim)
var prob_name = fs.readFileSync('problem_titles.txt').toString().replace(/\r\n/g,'\n').split('\n')
var prob_url = fs.readFileSync('problem_urls.txt').toString().replace(/\r\n/g,'\n').split('\n')

final_ans=[]
for(i=0;i<rows;i++)
{
  final_ans.push([sim[i],i]);
}
final_ans.sort(function (a, b) {
  return b[0] - a[0]
})

  //List of 5 questions

  
    var arr = [
      {
        title: prob_name[final_ans[0][1]],
        url: prob_url[final_ans[0][1]],
        statement: 'The sum of two elements.',
      },
      {
        title: prob_name[final_ans[1][1]],
        url: prob_url[final_ans[1][1]],
        statement: 'The sum of two elements.',
      },
      {
        title: prob_name[final_ans[2][1]],
        url: prob_url[final_ans[2][1]],
        statement: 'The sum of two elements.',
      },
      {
        title: prob_name[final_ans[3][1]],
        url: prob_url[final_ans[3][1]],
        statement: 'The sum of two elements.',
      },
      {
        title: prob_name[final_ans[4][1]],
        url: prob_url[final_ans[4][1]],
        statement: 'The sum of two elements.',
      },
    ]
    res.json(arr)
  })
  

//Assigning Port to our application
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT)
})
