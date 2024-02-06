/**
 * 功能：
 * setCookie: 设置cookie
 * getCookie: 获取cookie
 *
 * 例子：
 *
 */

export default {
    /**
     * 设置cookie
     * @param name
     * @param value
     * @param days
     */
    setCookie(name, value, time = 1000 * 60 * 5) {
        var expires = '';
        if (time) {
            var date = new Date();
            const env = process.env.envMode || process.env.NODE_ENV;
            env === 'production'
                ? date.setTime(date.getTime() + time)
                : date.setTime(date.getTime() + time);
            expires = '; expires=' + date.toGMTString();
        }
        //document.cookie = name + '=' + value + expires + ';domain=.inframe.mobi; path=/; ';
        document.cookie = name + '=' + value + expires + '; path=/;';
    },
    /**
     * 获取cookie
     * @param name
     * @param cookieStr
     */
    getCookie(name, cookieStr) {
        const nameEQ = name + '=';
        const ca = (cookieStr || window.document.cookie).split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    }
};
