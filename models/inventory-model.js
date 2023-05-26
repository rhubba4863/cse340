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
    console.log("RPH3"+id);
    const result = await pool.query(
      'SELECT * FROM public.inventory WHERE inv_id = $1', 
      [id]
      )
      return result.rows[0]
    } catch (error) {
    console.error("inv_id error " + error)
  }
}

//Add all Methods here to export
module.exports = {getClassifications, getInventoryByClassificationId, getModalFeatures};
