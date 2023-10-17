const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');


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


app.use(morgan('combined'));

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
 app.get('/hej',(req, res)=>{

    res.send('hej world');
 });

 app.listen(3000, ()=>{
    debug('lyssnar på port 3000' );

 });