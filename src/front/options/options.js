import browser from 'webextension-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import FieldSet from "../components/FieldSet";
import FormGroup from "../components/FormGroup";
import FormCheck from "../components/FormCheck";

import useParams from "../hooks/useParams";

import 'bootstrap';
import './styles.scss';

import {
  EVENT_INPUT_OPTION_CREDENTIALS_CHECK,
  EVENT_INPUT_OPTION_SERVER_CHECK,
  LOCALE_OPTION_AUTH_SETTINGS_BTN_CHECK,
  LOCALE_OPTION_AUTH_SETTINGS_LOGIN_HELP_TEXT,
  LOCALE_OPTION_AUTH_SETTINGS_LOGIN_LABEL,
  LOCALE_OPTION_AUTH_SETTINGS_LOGIN_PLACEHOLDER,
  LOCALE_OPTION_AUTH_SETTINGS_PASSWORD_HELP_TEXT,
  LOCALE_OPTION_AUTH_SETTINGS_PASSWORD_LABEL,
  LOCALE_OPTION_AUTH_SETTINGS_PASSWORD_PLACEHOLDER,
  LOCALE_OPTION_AUTH_SETTINGS_TITLE, LOCALE_OPTION_HEAD_TITLE,
  LOCALE_OPTION_NOTIF_SETTINGS_FEEDS_LIMIT_HELP_TEXT,
  LOCALE_OPTION_NOTIF_SETTINGS_FEEDS_LIMIT_LABEL,
  LOCALE_OPTION_NOTIF_SETTINGS_IS_ACTIVATE_HELP_TEXT,
  LOCALE_OPTION_NOTIF_SETTINGS_IS_ACTIVATE_LABEL,
  LOCALE_OPTION_NOTIF_SETTINGS_TITLE,
  LOCALE_OPTION_NOTIF_SETTINGS_UPDATE_DELAY_HELP_TEXT,
  LOCALE_OPTION_NOTIF_SETTINGS_UPDATE_DELAY_INDICATOR,
  LOCALE_OPTION_NOTIF_SETTINGS_UPDATE_DELAY_LABEL,
  LOCALE_OPTION_SERVER_SETTINGS_API_URL_HELP_TEXT,
  LOCALE_OPTION_SERVER_SETTINGS_API_URL_LABEL,
  LOCALE_OPTION_SERVER_SETTINGS_API_URL_PLACEHOLDER,
  LOCALE_OPTION_SERVER_SETTINGS_BTN_CHECK,
  LOCALE_OPTION_SERVER_SETTINGS_TITLE,
  LOCALE_OPTION_SERVER_SETTINGS_URL_HELP_TEXT,
  LOCALE_OPTION_SERVER_SETTINGS_URL_LABEL,
  LOCALE_OPTION_SERVER_SETTINGS_URL_PLACEHOLDER,
  LOCALE_OPTION_TITLE,
  PARAM_ACTIVE_NOTIFICATIONS,
  PARAM_LOGIN, PARAM_NB_FETCH_ITEMS,
  PARAM_PASSWORD_API,
  PARAM_REFRESH_TIME,
  PARAM_URL_API,
  PARAM_URL_MAIN,
} from "../../both/constants";
import useTitle from "../hooks/useTitle";

const __ = (localeId, substitutions) => browser.i18n.getMessage(
  localeId,
  typeof substitutions === 'number'
    ? String(substitutions)
    : substitutions
);

function OptionPage() {
  const [params, dispatch] = useParams();
  
  useTitle(__(LOCALE_OPTION_HEAD_TITLE));
  
  const onButtonServerCheck = (event) => {
    event.preventDefault();
    
    browser.runtime.sendMessage({
      name: EVENT_INPUT_OPTION_SERVER_CHECK,
      [PARAM_URL_MAIN]: params[PARAM_URL_MAIN],
      [PARAM_URL_API]: params[PARAM_URL_API],
    }).catch(console.error);
  };
  
  const onButtonAuthCheck = (event) => {
    event.preventDefault();
    
    browser.runtime.sendMessage({name: EVENT_INPUT_OPTION_CREDENTIALS_CHECK}).catch(console.error);
  };
  
  return (
    <>
      <h1>{__(LOCALE_OPTION_TITLE)}</h1>
      
      <form>
        {/* Server Settings */}
        <FieldSet legend={__(LOCALE_OPTION_SERVER_SETTINGS_TITLE)}>
          {/* Main URL */}
          <FormGroup
            label={__(LOCALE_OPTION_SERVER_SETTINGS_URL_LABEL)}
            help={__(LOCALE_OPTION_SERVER_SETTINGS_URL_HELP_TEXT)}
            placeholder={__(LOCALE_OPTION_SERVER_SETTINGS_URL_PLACEHOLDER)}
            uid={PARAM_URL_MAIN}
            value={params[PARAM_URL_MAIN]}
            onChange={(e) => dispatch({type: PARAM_URL_MAIN, value: e.target.value})}
          />
          
          {/* API URL */}
          <FormGroup
            label={__(LOCALE_OPTION_SERVER_SETTINGS_API_URL_LABEL)}
            help={__(LOCALE_OPTION_SERVER_SETTINGS_API_URL_HELP_TEXT)}
            placeholder={__(LOCALE_OPTION_SERVER_SETTINGS_API_URL_PLACEHOLDER)}
            uid={PARAM_URL_API}
            value={params[PARAM_URL_API]}
            onChange={(e) => dispatch({type: PARAM_URL_API, value: e.target.value})}
          />
          
          <button className="btn btn-secondary" type="button" onClick={onButtonServerCheck}>
            {__(LOCALE_OPTION_SERVER_SETTINGS_BTN_CHECK)}
          </button>
        </FieldSet>
        
        {/* Auth Settings */}
        <FieldSet legend={__(LOCALE_OPTION_AUTH_SETTINGS_TITLE)}>
          {/* Login */}
          <FormGroup
            label={__(LOCALE_OPTION_AUTH_SETTINGS_LOGIN_LABEL)}
            help={__(LOCALE_OPTION_AUTH_SETTINGS_LOGIN_HELP_TEXT)}
            placeholder={__(LOCALE_OPTION_AUTH_SETTINGS_LOGIN_PLACEHOLDER)}
            uid={PARAM_LOGIN}
            value={params[PARAM_LOGIN]}
            onChange={(e) => dispatch({type: PARAM_LOGIN, value: e.target.value})}
          />
          
          {/* Password */}
          <FormGroup
            label={__(LOCALE_OPTION_AUTH_SETTINGS_PASSWORD_LABEL)}
            help={__(LOCALE_OPTION_AUTH_SETTINGS_PASSWORD_HELP_TEXT)}
            placeholder={__(LOCALE_OPTION_AUTH_SETTINGS_PASSWORD_PLACEHOLDER)}
            uid={PARAM_PASSWORD_API}
            value={params[PARAM_PASSWORD_API]}
            onChange={(e) => dispatch({type: PARAM_PASSWORD_API, value: e.target.value})}
            inputProps={{type: 'password'}}
          />
          
          <button className="btn btn-secondary" type="button" onClick={onButtonAuthCheck}>
            {__(LOCALE_OPTION_AUTH_SETTINGS_BTN_CHECK)}
          </button>
        </FieldSet>
        
        {/* Notification Settings */}
        <FieldSet legend={__(LOCALE_OPTION_NOTIF_SETTINGS_TITLE)}>
          {/* Update Delay */}
          <FormGroup
            label={__(LOCALE_OPTION_NOTIF_SETTINGS_UPDATE_DELAY_LABEL)}
            help={__(LOCALE_OPTION_NOTIF_SETTINGS_UPDATE_DELAY_HELP_TEXT)}
            uid={PARAM_REFRESH_TIME}
            value={params[PARAM_REFRESH_TIME]}
            onChange={(e) => dispatch({type: PARAM_REFRESH_TIME, value: e.target.value})}
            inputProps={{type: 'range', min: 1, max: 30}}
            renderInput={({uid, value, onChange, inputProps, helpuid, detailuid = uid + '-detail'}) => (
              <div className="input-group" style={{alignItems: 'center'}}>
                <input
                  id={uid} className="form-control" style={{height: '100%'}}
                  aria-describedby={helpuid} aria-details={detailuid}
                  value={value} onChange={onChange} {...inputProps}
                />
                <div id={detailuid} className="input-group-addon">
                  {__(LOCALE_OPTION_NOTIF_SETTINGS_UPDATE_DELAY_INDICATOR, value)}
                </div>
              </div>
            )}
          />
          
          {/* Notification activated */}
          <FormCheck
            label={__(LOCALE_OPTION_NOTIF_SETTINGS_IS_ACTIVATE_LABEL)}
            help={__(LOCALE_OPTION_NOTIF_SETTINGS_IS_ACTIVATE_HELP_TEXT)}
            checked={params[PARAM_ACTIVE_NOTIFICATIONS]}
            value="1"
            onChange={(e) => dispatch({type: PARAM_REFRESH_TIME, value: e.target.value === '1'})}
          />
          
          {/* Feed limit */}
          <FormGroup
            label={__(LOCALE_OPTION_NOTIF_SETTINGS_FEEDS_LIMIT_LABEL)}
            help={__(LOCALE_OPTION_NOTIF_SETTINGS_FEEDS_LIMIT_HELP_TEXT)}
            uid={PARAM_NB_FETCH_ITEMS}
            value={params[PARAM_NB_FETCH_ITEMS]}
            inputProps={{type: 'number', step: 1, min: 1, max: 10}}
            onChange={(e) => dispatch({type: PARAM_NB_FETCH_ITEMS, value: e.target.value})}
          />
        </FieldSet>
      </form>
    </>
  );
}

ReactDOM.render(
  <OptionPage/>,
  document.getElementById('root'),
);