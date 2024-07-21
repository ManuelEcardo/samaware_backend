const SignKey='default_Key_to_sign';

/** Store the ws connected clients **/
let clients = new Map();

/** Store manager connected via ws **/
let wsManager = new Map();

/** Allowed fields to be updated in order **/
const allowedOrderUpdates=['id', 'workerId', 'clientId', 'status', 'registration_date','shipping_date','preparation_starting_date','preparation_end_date',];

/** Pagination Defaults **/
const pageDefault=1;
const limitDefault=3;

export default {SignKey, clients, wsManager, pageDefault, limitDefault}