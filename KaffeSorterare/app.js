const fs = require('fs');
const xml2js = require('xml2js');
const bodyParser = require('body-parser');
const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');

const filePath = path.join(__dirname, '/public/fileLoader.xml');

 const app = express();

 var myHeaders = new Headers();
 myHeaders.append("Cookie", "ASP.NET_SessionId=tasy44okghmgtchscwcl2gqc");
 
 var requestOptions = {
   method: 'GET',
   headers: myHeaders,
   redirect: 'follow'
 };

 var obj;
 fetch("https://www.vattenfall.se/api/price/spot/pricearea/2023-10-16/2023-10-16/SN3/", requestOptions)
   .then(response => response.text())
   .then(result => {
      obj = result
      console.log(result)})
   .catch(error => console.log('error', error));

app.use(express.urlencoded({extended: true}));
app.use(express.json()) // To parse the incoming requests with JSON payloads   
app.use(morgan('combined'));
app
//vi kollar alltid om det finns en statisk websida i public innan
//vi ser om det finns en vy eller ett statiskt meddelande.
app.use(express.static(path.join(__dirname, '/public/')));

//Nästa ställe att kolla är i src/views
app.set('views', './src/views');
app.set('view engine', 'ejs');

//här används en viewengine
 app.get('/',(req, res)=>{

    res.render('index',{myVar:"Min egna variabel som vi skickar till vyn"});
 });

 app.get('/lista',(req, res)=>{
   var v = [];
   for (key in obj) {
      v.push(key)
    }

   res.render('lista',{myVar:[1,4,2,6,9,5,900,5,3],obj:JSON.parse(obj)});
});


 //här skickas bara ett statiskt meddelande

 app.post('/spara', (req, res)=>{

   var people = [];
   // Läs innehållet från XML-filen
   fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        console.error('Fel vid läsning av filen:', err);
        return;
      }
    
      // Konvertera XML till JSON med xml2js
      xml2js.parseString(data, (parseErr, result) => {
        if (parseErr) {
          console.error('Fel vid konvertering från XML till JSON:', parseErr);
          return;
        }
    
        // Resultatet är nu ett JSON-objekt
        console.log('Innehållet i XML-filen som JSON:', result);
    
        // Du kan komma åt personerna som ett JavaScript-objekt
         people = result.people.person;
    
        // Gör något med personerna här...

// Lägg till en ny person
const newPerson = { firstname: req.body.firstName, lastname: req.body.lastName, email: req.body.email, birthday: req.body.birthday };
people.push(newPerson);

// Skapa XML-strängen från personobjekten
const xmlString = `<people>
${people.map(person => `
  <person>
    <firstname>${person.firstname}</firstname>
    <lastname>${person.lastname}</lastname>
    <email>${person.email}</email>
    <birthday>${person.birthday}</birthday>
  </person>`).join('\n')}
</people>`;


// Skriv XML-strängen till filen
fs.writeFile(filePath, xmlString, (err) => {
   if (err) {
     console.error('Fel vid skrivning till fil:', err);
   } else {
     console.log('XML-filen har skrivits till disk:', filePath);
   }
 });

 res.redirect( '/test.html');
      });
    });




 });




 app.get('/hej',(req, res)=>{

   res.send('hej world');
});

app.get('/svara',(req, res)=>{

  res.send('hej svar');
});


 app.listen(3000, ()=>{
    debug('lyssnar på port 3000' );

 });