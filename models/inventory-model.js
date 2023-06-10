/*START ACCESS TO THE POOL*/
const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory AS i JOIN public.classification "+ 
      "AS c ON i.classification_id = c.classification_id "+
      "WHERE i.classification_id = $1",
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}
 
/**********************************
 * RPH unit 3: Get all data for 1 modal
 *********************************/
async function getModalFeatures(id){
  try {
    const result = await pool.query(
      'SELECT * FROM public.inventory WHERE inv_id = $1', 
      [id]
      )
      return result.rows[0]
    } catch (error) {
    console.error("inv_id error " + error)
  }
}

/* *****************************
*   Register new classification
* *************************** */
async function registerClassification(classification_name){
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
} 

/* *****************************
*   Register new inventory car
* *************************** */
async function registerIntoInventory(classification_id, inv_make, inv_model,   
  inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color,
  ){
    console.log("Carrot Cake1:"+classification_id)

  try {
    console.log("Carrot Cake2:"+classification_id)
    const sql = "INSERT INTO public.inventory (classification_id, inv_make, inv_model, " 
      +"inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color"
      +" ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [classification_id, inv_make, inv_model,   
      inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Get all classification types
 * ************************** */
// async function getClassifications(){
//   return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
// }

//Add all Methods here to export
module.exports = {getClassifications, getInventoryByClassificationId, getModalFeatures, registerClassification, registerIntoInventory};
