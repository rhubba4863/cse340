/*START ACCESS TO THE POOL*/
const pool = require("../database/index.js")


/* ***************************
 *  Get all archive message data
 * (Get all classifications and info for each)
 * ************************** */
async function getArchiveMessagesForUser(accountData){
  let userid=accountData.account_id
  return await pool.query("SELECT * FROM public.message WHERE message_archived = "
  +"true AND message_to=$1 ORDER BY message_id", [userid])
}

async function getArchiveMessagesForUserByID(userid){
  return await pool.query("SELECT * FROM public.message WHERE message_archived = "
  +"true AND message_to=$1 ORDER BY message_id", [userid])
}

/* ***************************
 *  Get all message data
 * (Get all classifications and info for each)
 * ************************** */
async function getMessagesForUser(accountData){
  let userid=accountData.account_id
  return await pool.query("SELECT * FROM public.message WHERE message_archived = "
  +"false AND message_to=$1 ORDER BY message_id", [userid])
}

async function getUnreadMessages(userid){
  return await pool.query("SELECT * FROM public.message WHERE message_archived = "
  +"false AND message_read = false AND message_to=$1 ORDER BY message_id", [userid])
}

/**********************************
 * Get all data for 1 message
 *********************************/
async function getMessageFeatures(id){
  try {
    const result = await pool.query(
      'SELECT * FROM public.message WHERE message_id = $1', 
      [id]
      )
      return result.rows[0]
    } catch (error) {
    console.error("inv_id error " + error)
  }
}

// async function getUnreadMessages(){
//   return await pool.query("SELECT * FROM public.message ORDER BY message_id WHERE message_read = false")
// }

async function getArchivedMessages(){
  return await pool.query("SELECT * FROM public.message ORDER BY message_id WHERE message_archived = true")
}

/* *****************************
*   Mark message as read
* *************************** */
async function makeMessageRead(id){
  try {
    const result = await pool.query(
      'UPDATE public.message SET message_read = true WHERE message_id = $1;'
      ,[id]
      )
      return getMessageFeatures(id)
    } catch (error) {
    console.error("id error for makeMessageRead()" + error)
  }
}
/* *****************************
*   Register new message
* *************************** */
async function registerIntoMessages(
    message_subject, message_body, 
    message_created, message_to, 
    message_from,    message_read, 
    message_archived,
  ){
    try {
      const sql = "INSERT INTO public.message (message_subject, message_body, message_created, "
        +"message_to, message_from, message_read, message_archived)" 
        +" VALUES ($1, $2, DEFAULT, $3, $4, DEFAULT, DEFAULT) RETURNING *"
      return await pool.query(sql, [message_subject, message_body, message_to, 
        message_from])
    } catch (error) {
      console.log("PHUBBS ")
      return error.message
    }
}

async function deleteTheMessage(message_id){
  try {
    const sql = "DELETE FROM message WHERE message_id = $1"
    const data = await pool.query(sql, [message_id])  
    return data
  } catch (error) {
    new Error("Delete Inventory Error")
  }    
}

async function archiveTheMessage(message_id){
  try {
    const sql = "UPDATE message SET message_archived = true WHERE message_id = $1"
    const data = await pool.query(sql, [message_id])  
    return data
  } catch (error) {
    new Error("Delete Inventory Error")
  }    
}


//Export for use
module.exports = {
  getMessagesForUser, getUnreadMessages, getArchivedMessages, registerIntoMessages,
  getMessageFeatures, makeMessageRead, deleteTheMessage, getArchiveMessagesForUser,
  getArchiveMessagesForUserByID, archiveTheMessage
}