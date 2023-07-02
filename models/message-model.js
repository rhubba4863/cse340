/*START ACCESS TO THE POOL*/
const pool = require("../database/index.js")


/* ***************************
 *  Get all message data
 * (Get all classifications and info for each)
 * ************************** */
async function getMessagesForUser(accountData){
  let userid=accountData.account_id
  return await pool.query("SELECT * FROM public.message WHERE message_archived = "
  +"false AND message_to=$1 ORDER BY message_id", [userid])
}

async function getMessages(){
  return await pool.query("SELECT * FROM public.message WHERE message_archived = "
  +"false AND message_to=28 ORDER BY message_id")
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

async function getUnreadMessages(){
  return await pool.query("SELECT * FROM public.message ORDER BY message_id WHERE message_read = false")
}

async function getArchivedMessages(){
  return await pool.query("SELECT * FROM public.message ORDER BY message_id WHERE message_archived = true")
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

    console.log("1 subj) " + message_subject)
    console.log("2 body) " + message_body)
    console.log("3 crea) " + message_created)
    console.log("4 mest) " + message_to)
    console.log("5 mesf) " + message_from)
    console.log("6 read) " + message_read)
    console.log("7 arch) " + message_archived)

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
  

  // try {
  //   const sql = "INSERT INTO public.message (message_subject, message_body, message_created, "
  //     +"message_to, message_from, message_read, message_archived)" 
  //     +" VALUES ($1, $2, DEFAULT, $4, $5, DEFAULT, DEFAULT) RETURNING *"
  //   return await pool.query(sql, [message_subject, message_body, message_created, message_to, 
  //     message_from, message_read, message_archived])
  // } catch (error) {
  //   console.log("PHUBBS ")
  //   return error.message
  // }

  // try {
  //   const sql = "INSERT INTO public.message (message_subject, message_body, message_created, "
  //     +"message_to, message_from, message_read, message_archived)" 
  //     +" VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *"
  //   return await pool.query(sql, [message_subject, message_body, message_created, message_to, 
  //     message_from, message_read, message_archived])
  // } catch (error) {
  //   return error.message
  // }
}

//Export for use
module.exports = {
  getMessagesForUser, getMessages, getUnreadMessages, getArchivedMessages, registerIntoMessages,
  getMessageFeatures
}