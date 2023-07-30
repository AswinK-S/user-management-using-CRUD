const Customer = require('../models/Customer');
const mongoose = require('mongoose');


/**
* GET /
* Homepage
*/


exports.homepage = async (req,res) =>{

    
  const locals = {
     title:"WELCOME",
     description:"Study user management system"        
     }   
     
     let perPage =12;
     let page = req.query.page || 1;


     try {
      const customers = await Customer.aggregate([{$sort: {updatedAt: -1}}]).skip(perPage * page - perPage).limit(perPage).exec();
      const count= await Customer.count();
      
      res.render('index',{
        locals,
        customers,
        current: page,
        pages : Math.ceil(count/perPage)
      });

     } catch (error) {
      console.log(error)
     }
}





// exports.homepage = async (req,res) =>{

    
//   const locals = {
//      title:"WELCOME",
//      description:"Study user management system"        
//      }        
//      try {
//       const customers = await Customer.find({}).limit(22);
//       res.render('index',{ locals, customers });            

//      } catch (error) {
//       console.log(error)
//      }
// }


/**
* GET /
* New Customer form
*/
exports. addCustomer = async (req,res) =>{
    
  const locals = {
     title:"Add New Customer",
     description:"Welcome New Customers"        
     }        
    res.render('customer/add', locals );            
}

/**
* POST /
* Create New Customer form
*/

exports. postCustomer = async (req,res) =>{
  
  console.log(req.body);

  const newCustomer = new Customer({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    tel: req.body.tel,
    details: req.body.details
  })

  try {
    await Customer.create(newCustomer);
    // await req.flash('info','New customer has been added.')

    res.redirect('/')            
  } catch (error) {
    console.log(error)
  }     
     
}


/**
* GET /
* Customer data
*/
exports.view = async (req,res) =>{
  try{
    const customer = await Customer.findOne({_id: req.params.id })

    const locals = {
      title:"view customer data",
      description:"customer details"
    };
    res.render('customer/view',{
      locals,
      customer
    })
  }
  catch(error){
    console.log(error);
  }
}



/**
* GET /
*  Edit Customer data
*/
exports.edit = async (req,res) =>{
  try{
    const customer = await Customer.findOne({_id: req.params.id })

    const locals = {
      title:"edit customer data",
      description:"edit customer details"
    };
    res.render('customer/edit',{
      locals,
      customer
    })
  }
  catch(error){
    console.log(error);
  }
}


/**
* GET /
*  Update Customer data
*/
exports.editPost = async (req,res) =>{
  try{
    await Customer.findByIdAndUpdate(req.params.id,{
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      tel: req.body.tel,
      email: req.body.email,
      details: req.body.details,
      updatedAt: Date.now()
    })
    await res.redirect(`/edit/${req.params.id}`);
    console.log('redirected');
  }
  catch(error){
    console.log(error);
  }
}

/**
* GET /
*  Update Customer data
*/
exports.deleteCustomer = async (req,res) =>{
try {
  await Customer.deleteOne({_id:req.params.id});
  res.redirect('/')
} catch (error) {
  console.log(error)
}
}

/**
* GET /
*  Search Customer data
*/
exports.searchCustomers = async (req,res) =>{
  const locals = {
    title:"Search customer data ",
    description: "Search customer details"
  }
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar =searchTerm.replace(/[^a-zA-Z0-9]/g,"");

    const customers =await Customer.find({
      $or:[{firstName:{$regex: new RegExp(searchNoSpecialChar,"i")}},
    {lastName:{$regex: new RegExp(searchNoSpecialChar,"i")}}]
    });
    res.render("search",{
      customers,
      locals
    })
  } catch (error) {
    console.log(error);
  }
  }