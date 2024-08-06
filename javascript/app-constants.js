const USER_TYPE_ARTIST = 1000;
const USER_TYPE_ORGANISER = 2000;
const ARTIST_TABLE = 'artists';
const ORGANISER_TABLE = 'organisers';
const TABLE_USER_TYPE = 'user-type';
const TABLE_BOOKINGS = 'bookings';
const TABLE_CHAT = 'chat';
const TABLE_NOTIFICATIONS = 'notifications';

const STATUS_PENDING = 1000;
const STATUS_ACCEPTED = 2000;
const STATUS_DECLINED = 3000;


function getStatus(status) {
    if(status === STATUS_ACCEPTED) {
        return 'Accepted'
    } else if(status === STATUS_DECLINED) {
        return 'Declined'
    } else {
        return 'Pending'
    }
}

export {
    USER_TYPE_ARTIST,
    USER_TYPE_ORGANISER,
    ARTIST_TABLE,
    ORGANISER_TABLE,
    TABLE_USER_TYPE,
    TABLE_BOOKINGS,
    TABLE_CHAT,
    TABLE_NOTIFICATIONS,
    STATUS_PENDING,
    STATUS_ACCEPTED,
    STATUS_DECLINED,
    getStatus
}