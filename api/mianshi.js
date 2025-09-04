import fn from '../utils/fn'

module.exports = {
    // list
    getList: (params) => {
        return fn.get('https://m1.apifoxmock.com/m1/620884-0-default/topic/getList', params, true);
    },

    // submit https://m1.apifoxmock.com/m2/620884-0-default/345884397
    submit: (params) => {
        // return fn.post('topic/submit', params, 'json');
        return fn.post('https://m1.apifoxmock.com/m2/620884-0-default/345884397', params, 'json');
    },
}