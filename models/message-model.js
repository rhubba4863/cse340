/*START ACCESS TO THE POOL*/
const pool = require("../database/index.js")


/* ***************************
 *  Get all message data
 * (Get all classifications and info for each)
 * ************************** */
async function getMessages(){
  return await pool.query("SELECT * FROM public.message ORDER BY message_id")
}
                //getMessagesForOne
// async function getMessages(receivedBy){
//   return await pool.query("SELECT * FROM public.message ORDER BY message_id WHERE message_to = "
//   +"$1",[receivedBy])
// }

async function getUnreadMessages(){
  return await pool.query("SELECT * FROM public.message ORDER BY message_id WHERE message_read = false")
}

async function getArchivedMessages(){
  return await pool.query("SELECT * FROM public.message ORDER BY message_id WHERE message_read = false")
}

//Export for use
module.exports = {
  getMessages, getUnreadMessages, getArchivedMessages
}