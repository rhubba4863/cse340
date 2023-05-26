const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 * RPH: Header links
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul class='header-link-options'>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li class="car-modal">'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildCarDetailView = async function(data){
  let grid = '<ul id="inv-car-modal">'
  let pictureSide
  let detailSide

  pictureSide = '<li class="inv-car-modal-columns"><div>'
  + '<img id="mainCarPicture" src="'+data.inv_image+'">'
  + '</div></li>';

  detailSide =  '<li class="inv-car-modal-columns"><div id=mainCarDetails>'
  + '<div id="infoTitle">About this item</div>'
  + '<div><span class="bold">Milage: </span>'+
  new Intl.NumberFormat('en-US').format(data.inv_miles) +'</div>'
  + '<div><span class="bold">Price: </span>$'+
  new Intl.NumberFormat('en-US').format(data.inv_price)+'</div>'
  + '<div><span class="bold">Color: </span>'+data.inv_color+'</div>'
  + '<div><span class="bold">Description: </span>'+data.inv_description+'</div>'
  + '<div><span class="bold">Stock Number: </span>'+data.classification_id+'</div>'

  + '</li>';

  grid += pictureSide
  grid += detailSide

  
  // grid += '<li class="inv-car-modal-columns">HELP</li>'
  // grid += '<li class="inv-car-modal-columns">HELP</li>'

  grid += '</ul>'

  // detailSide += '<div>1:'+data.inv_make+'</div>';
  // detailSide += '<div>2:'+data.inv_model+'</div>';
  // detailSide += "<div>3:"+data.inv_year+"</div>";
  detailSide += "<div>4:"+data.inv_description+"</div>";
  // detailSide += '5<img src="'+data.inv_image+'">'
  // detailSide += '6<img src="'+data.inv_thumbnail+'">'
  // detailSide += "<div>7:"+data.inv_price+"</div>"
  // detailSide += "<div>8:"+data.inv_miles+"</div>"
  detailSide += "<div>9:"+data.inv_color+"</div>"
  detailSide += "<div>10:"+data.classification_id+"</div>"

  grid += '<div id=priceBox></div>'

  // grid += pictureSide  
  // grid += detailSide 
  return grid;
   // return "<div>hellow world "+data.inv_make+"</div>"
}



/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

//NOTE - ALWAYS LAST STEP - RPH/TEACHER
module.exports = Util