var APP21 = window.app21 || {};

const CALL_PHONE = (phone) => {
    if (typeof APP21.prom !== 'undefined') {
        APP21.prom('TEL', phone);
    }
}

const OPEN_LINK = (link) => {
    if (typeof APP21.prom !== 'undefined') {
        APP21.prom('BROWSER', link);
    }
}

const SET_BADGE = (count) => {
    if (typeof APP21.prom !== 'undefined') {
        APP21.prom('SET_BADGE', count);
    }
}

const REMOVE_BADGE = (count) => {
    if (typeof APP21.prom !== 'undefined') {
        APP21.prom('REMOVE_BADGE', count);
    }
}

const OPEN_QRCODE = () => {
    if (typeof APP21.prom !== 'undefined') {
        return APP21.prom('OPEN_QRCODE');
    }
}

const SEND_TOKEN_FIREBASE = () => {
    if (typeof APP21 !== 'undefined') {
        return new Promise((resolve, reject) => {
            APP21.prom('KEY', JSON.stringify({
                key: 'FirebaseNotiToken'
            })).then(({
                data
            }) => {
                resolve({
                    token: data
                });
            }).catch(({
                error
            }) => {
                resolve({
                    error: error
                })
            })
        });
    } else {
        return new Promise((resolve, reject) => {
            resolve({
                error: "Yêu cầu nâng cấp lên phiên bản mới nhất."
            });
        });
    }
}

const CLOSE_APP = () => {
    if (typeof APP21 !== 'undefined') {
        return APP21.prom('FINISH_ACTIVITY');
    }
}

/**
 * ##_STATUS_BAR_COLOR
 * @param {string} color (`light` ? light : dark)
 * @param {string} name (see `requireScript`)
 * @param {string} version (see `requireScript`)
 * @param {Function} callback (see `requireScript`)
 */
const STATUS_BAR_COLOR = (color) => {
    if (typeof APP21 !== 'undefined') {
        return APP21.prom('STATUS_BAR_COLOR', color);
    }
}

const PromHelpers = {
    CALL_PHONE,
    OPEN_LINK,
    SET_BADGE,
    REMOVE_BADGE,
    OPEN_QRCODE,
    SEND_TOKEN_FIREBASE,
    CLOSE_APP,
    STATUS_BAR_COLOR
}
export default PromHelpers;