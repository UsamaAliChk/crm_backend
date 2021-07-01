
const express=require('express');
const app=express();
const mysql = require('mysql');
const bodyParser=require('body-parser')
const fs=require('fs');
const http=require('http');
const https=require('https');
const cors=require('cors');
const { Console } = require('console');
const { isBuffer } = require('util');
const port = process.env.PORT || 3000;
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
//var privateKey  = fs.readFileSync('cert/key.pem');
//var certificate = fs.readFileSync('cert/cert.pem');

var privateKey  = fs.readFileSync('cert/private.key');
var certificate = fs.readFileSync('cert/certificate.crt');
var credentials = {key: privateKey, cert: certificate};
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
httpServer.listen(5000,(err)=>{
  if(err) console.log(err)
  else console.log("http server is connected")
});
httpsServer.listen(3000,(err)=>{
  if(err) console.log(err)
  else console.log("https server is connected")
});
var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "ec2mysql",
  password: "12345",
  database:"invoicdatabase",
  port:3306
});
  
  try{
      con.connect(function(err) {
        if (err) throw err;
        else{
          
        }
      });

  }

  catch(err){
    console.log(err)
  }
  

//app.listen(port, () => console.log(`Server running on port ${port} 🔥`));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get("/",(req,res)=>{
  res.send("Usama is here")
})
app.get("/getNoOfInvoices",(req,res)=>{
  con.query("select COUNT(invoiceId) as no_Of_invoices from invoice",(err,result,rows)=>{
    if(err) throw err;
    else{
      //console.log(result[0].no_Of_invoices)
      res.send(result[0])
    }
})
})

app.post("/bankdetails",(req,res)=>{
  console.log("Hello")
  con.query(`update company set
  bankName= '${req.body.bankName}',
  accountName= '${req.body.accountName}',
  accountNumber= '${req.body.accountNumber}',
  bicCode= '${req.body.bicCode}',
  swiftCode= '${req.body.swiftCode}',
  sortCode='${req.body.sortCode}',
  hasBankDetails= true where companyId=${req.body.companyId}`,(err,row)=>{
    if(err){
      throw err;
    }
    else{
      console.log("UPDATED")
      res.send('Updated')
      // con.query(`select * from company companyId=${req.body.companyId}`,(err,row)=>{
      //   if(err) throw err;
      //   else{
      //     console.log("Inserted")
      //     res.send(row)
      //   }
      //})
    }
  })
     
})

app.get("/companies", (req, res) => {
  con.query("select * from company",function(err,rows,feilds){
    if(err)
    throw err;
    else{
      res.send(rows)
    }
  })  
});


app.get("/bankDetail/:id",(req,res)=>{
  con.query(`select * from bankAccount where companyId = ${req.params.id}`,(err,row)=>{
    if(err) throw err;
    else{
      res.send(row)
    }
  })
})


app.get("/invoices",(req,res)=>{
  con.query("select * from invoice",function(err,rows,feilds){
    if(err)
    throw err;
    else{
      res.send(rows)
    }
  })  
})

app.get("/invoice/:id", (req, res) => {
  // console.log(req.params.id);
   con.query(`select * from invioce where invioceId=${req.params.id}`,function(err,rows,feilds){
     if(err)
     throw err;
     else{
      
       res.send(rows)
     }
   })
 });


 app.get("/companyAccount/:id", (req, res) => {
  // console.log(req.params.id);
   con.query(`select * from company , bankAccount where company.companyId=${req.params.id} and bankAccount.companyId=${req.params.id}`,function(err,rows,feilds){
     if(err)
     throw err;
     else{
       
      
     }
   })
 });

app.get("/company/:id", (req, res) => {
 // console.log(req.params.id);
  con.query(`select * from company where companyId=${req.params.id}`,function(err,rows,feilds){
    if(err)
    throw err;
    else{
     console.log("Helloo")
      res.send(rows)
    }
  })
});

app.post("/invoice",(req,res)=>{
  console.log("I am done with this Now")
  con.query(`insert into invoice (companyName,contactName,link,dueDate,issuedDate) values
   ('${req.body.companyName}','${req.body.contactName}','${req.body.link}','${req.body.issuedDate}','${req.body.dueDate}')`,(err)=>{
     if(err) res.send(err);
     else{ 
      res.send("inserted")
     }
   })
})



app.post("/contactUpdate",(req,res)=>{
  let id=req.body.id;
  con.query(`update contact set 
  firstName = '${req.body.first}',
  lastName = '${req.body.last}',
  title = '${req.body.title}',
  contactEmail='${req.body.Cemail}',
  contactType='${req.body.contactType}',
  Country='${req.body.Ccountry}',
  Address1='${req.body.address1}',
  contactPhoneNumber='${req.body.CNumber}',
  Address2='${req.body.address2}',
  Address3='${req.body.address3}',
  Town='${req.body.town}',
  County='${req.body.county}',
  companyName='${req.body.companyName}',
  postalCode='${req.body.postalcode}' where contactId=${id}`
  ,(err,result)=>{
    if(err) throw err;
    else {res.send("Updated Successfuly"); console.log(result.affectedRows + " record(s) updated")}
  })
})
 

app.get("/contacts/:id", (req, res) => {
  con.query(`select * from contact where contact.companyId=${req.params.id} `,function(err,rows,feilds){
    if(err)
    throw err;
    else{
      
      res.send(rows)
    }
  }) 
});

app.post("/contact",(req,res)=>{
  con.query(`insert into contact (companyId,contactType,companyName,title,firstName,lastName,contactEmail,Country,contactPhoneNumber,Address1,Address2,Address3,Town,County,postalCode) values
   ('${req.body.id}','${req.body.contactType}','${req.body.companyName}','${req.body.title}','${req.body.first}','${req.body.last}','${req.body.Cemail}','${req.body.Ccountry}','${req.body.CNumber}','${req.body.address1}','${req.body.address2}','${req.body.address3}','${req.body.town}','${req.body.county}','${req.body.postalcode}')`,(err)=>{
     if(err) throw err;
     else{ 
      res.send("inserted")
     }
   })
})

app.post("/company",(req,res)=>{
  console.log("IN COMPANY")
  con.query(`insert into company (companyName,
    chairPersonName,chairPersonEmail,chairPersonNumber,logoUrl,companyEmail,
    Country,companyPhoneNumber,Address1,Address2,Address3,Town,County,postalCode,vat,hasBankDetails) values
   ('${req.body.Cname}',
   '${req.body.name}',
   '${req.body.cpEmail}',
   '${req.body.cpNumber}',
   '${req.body.logo}',
   '${req.body.Cemail}',
   '${req.body.Ccountry}',
   '${req.body.CNumber}',
   '${req.body.address1}',
   '${req.body.address2}',
   '${req.body.address3}',
   '${req.body.town}',
   '${req.body.county}',
   '${req.body.postalcode}',
   '${req.body.vat}',false)`,(err)=>{
     if(err) throw err;
     else{ 
      con.query(`select * from company`,function(err,rows,feilds){
        if(err)
        throw err;
        else{
          res.send(rows)
        }
      })
     }
   })
})

app.post("/companyUpdate",(req,res)=>{
  let id=req.body.id;
  console.log("HELLO")
  console.log(req.body)
  con.query(`update company set 
  companyName = '${req.body.Cname}',
  companyEmail='${req.body.Cemail}',
  Country='${req.body.Ccountry}',
  Address1='${req.body.address1}',
  companyPhoneNumber='${req.body.CNumber}',
  Address2='${req.body.address2}',
  Address3='${req.body.address3}',
  Town='${req.body.town}',
  County='${req.body.county}',
  postalCode='${req.body.postalcode}',
  chairPersonName='${req.body.name}',
  chairPersonEmail='${req.body.cpEmail}',
  chairPersonNumber='${req.body.cpNumber}',
  vat=${req.body.vat} where companyId=${id}`
  ,(err,result)=>{
    if(err) throw err;
    else {res.send("Updated Successfuly"); console.log(result.affectedRows + " record(s) updated")}
  })
})