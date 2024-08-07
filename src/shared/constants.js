import dotenv from "dotenv";

dotenv.config();

const SignKey=process.env.SIGN_KEY; //'default_Key_to_sign';

const localUrl=process.env.LOCAL_URL;  //'mongodb://127.0.0.1:27017/samahware';

const atlasUrl= process.env.ATLAS_URL; //'mongodb+srv://GaryMorge:ZG6qoffoOwIGmIL6@cluster0.g8wf9vk.mongodb.net/samahware';


/** Store the ws connected clients **/
let clients = new Map();

/** Store manager connected via ws **/
let wsManager = new Map();

/** Allowed fields to be updated in order **/
const allowedOrderUpdates=['id', 'workerId', 'clientId', 'status', 'registration_date','shipping_date','preparation_starting_date','preparation_end_date',];

/** Pagination Defaults **/
const pageDefault=1;
const limitDefault=3;

const clientLimitDefault=15;


/**Preparation Team, not in database because I don't want to create table specifically for them now **/
const preparationTeam=['صالح مشمش', 'شادي صارم', 'مهند عبد الكريم', 'علاء وهبة', 'محمد حمزة', 'علي فاعور', 'حسن زين', 'عمار سركل', 'بسام الصيادي', 'حسام الكردي', 'عبد القادر الحوت', 'مثقال عبد الخالق', 'امير شاهين', 'حسان الفرخ'];

export default {SignKey, clients, wsManager, pageDefault, limitDefault, localUrl, atlasUrl, preparationTeam, clientLimitDefault}