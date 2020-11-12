// import { init as SDKinit } from '@livechat/customer-sdk';

const BinarySocket = require('./socket_base');
const ClientBase = require('./client_base');

const LiveChat = (() => {
    let logged_in = false;
    const initial_session_variables = { loginid: '', landing_company_shortcode: '', currency: '', residence: '', email: '' };
    const init = () => {
        if (window.LiveChatWidget) {
            window.LiveChatWidget.call('set_session_variables', initial_session_variables);

            BinarySocket.wait('get_settings').then((response) => {
                const get_settings = response.get_settings || {};
                const { first_name, last_name } = get_settings;
                const email = ClientBase.get('email');

                if (email) window.LiveChatWidget.call('set_customer_email', email);
                if (first_name && last_name) window.LiveChatWidget.call('set_customer_name', `${first_name} ${last_name}`);
            });

            // const customerSDK = SDKinit({
            //     licenseId: 12049137,
            //     clientId : '66aa088aad5a414484c1fd1fa8a5ace7',
            // });

            const checkLoginStatus = () => {
                if (ClientBase.isLoggedIn()) {
                    if (logged_in === false) {
                        // const loginid = ClientBase.get('loginid');
                        // const landing_company_shortcode = ClientBase.get('landing_company_shortcode');
                        // const currency = ClientBase.get('currency');
                        // const residence = ClientBase.get('residence');
                        // const email = ClientBase.get('email');

                        // const client_session_variables = {
                        //     ...loginid && { loginid },
                        //     ...landing_company_shortcode && { landing_company_shortcode },
                        //     ...currency && { currency },
                        //     ...residence && { residence },
                        //     ...email && { email },
                        // };

                        // window.LiveChatWidget.call('set_session_variables', client_session_variables);
                        // do logged in stuffs
                    }
                    logged_in = true;
                } else {
                    if (logged_in === true) {
                        // if (window.LiveChatWidget.get('chat_data')) {
                        //     const chatID = window.LiveChatWidget.get('chat_data').chatId;
                        //     customerSDK.deactivateChat({ chatId: chatID });
                        // }
                        // window.LiveChatWidget.call('set_customer_email', ' ');
                        // window.LiveChatWidget.call('set_customer_name', ' ');
                    }
                    logged_in = false;
                }
            };

            setInterval(checkLoginStatus, 500);

            window.LiveChatWidget.on('visibility_changed', ({ visibility }) => {
                // only visible to CS
                if (visibility === 'maximized' && ClientBase.isLoggedIn()) {
                    const loginid = ClientBase.get('loginid');
                    const landing_company_shortcode = ClientBase.get('landing_company_shortcode');
                    const currency = ClientBase.get('currency');
                    const residence = ClientBase.get('residence');
                    const email = ClientBase.get('email');

                    const client_session_variables = {
                        ...loginid && { loginid },
                        ...landing_company_shortcode && { landing_company_shortcode },
                        ...currency && { currency },
                        ...residence && { residence },
                        ...email && { email },
                    };

                    window.LiveChatWidget.call('set_session_variables', client_session_variables);
                }

                if (visibility === 'maximized' && !ClientBase.isLoggedIn()) {
                    if (
                        !(
                            window.LiveChatWidget.get('customer_data').status ===
                            'chatting'
                        )
                    ) {
                        window.LiveChatWidget.call('set_customer_email', ' ');
                        window.LiveChatWidget.call('set_customer_name', ' ');
                    }
                    window.LiveChatWidget.call('set_session_variables', initial_session_variables);
                }
            });
        }
    };

    return {
        init,
    };
})();

module.exports = LiveChat;
