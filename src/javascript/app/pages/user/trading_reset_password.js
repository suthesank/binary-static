const BinaryPjax     = require('../../base/binary_pjax');
const Dialog         = require('../../common/attach_dom/dialog');
const FormManager    = require('../../common/form_manager');
const localize       = require('../../../_common/localize').localize;
const getElementById = require('../../../_common/common_functions').getElementById;
const Url            = require('../../../_common/url');
const isEuCountry      = require('../../common/country_base').isEuCountry;

const TradingResetPassword = (() => {
    const responseHandler = (response) => {
        if (response.error) {
            getElementById('container_trading_reset_password').setVisibility(0);
            const $form_error = $('#form_error');
            getElementById('msg_reset_password').setVisibility(0);
            const err_msg = response.error.message;
            $form_error.find('#form_error_retry').setVisibility(0);
            getElementById('form_error_msg').innerHTML = err_msg;
            getElementById('form_error_cta').setVisibility(1);
            $form_error.setVisibility(1);
        } else {
            Dialog.alert({
                id               : 'success_reset_trading_pw_dialog',
                localized_message: localize('You have a new MT5 password to log in to your [_1] accounts on the web and mobile apps.', isEuCountry() ? 'CFDs' : 'MT5'),
                localized_title  : localize('Success'),
                ok_text          : localize('Done'),
                onConfirm        : () => { BinaryPjax.load(Url.urlFor('user/metatrader')); },
            });
        }
    };

    const onLoad = () => {
        const form_id = '#frm_trading_reset_password';

        FormManager.init(form_id, [
            { selector: '#have_real_account',  validations: ['req'], exclude_request: 1 },
            { selector: '#new_password',       validations: ['req', 'password'] },
            { request_field: 'trading_platform_password_reset', value: 1 },
            { request_field: 'platform', value: 'mt5' },
        ], true);

        FormManager.handleSubmit({
            form_selector       : form_id,
            fnc_response_handler: responseHandler,
        });
    };

    return {
        onLoad,
    };
})();

module.exports = TradingResetPassword;
