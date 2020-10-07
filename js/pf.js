type = 'text/javascript';

//PingFederate Info
const baseUrl = 'https://cusmorg.ping-eng.com';
const scopes = 'openid profile'; // default scopes to request
const responseType = 'token id_token'; // tokens to recieve

const landingUrl = baseUrl + '/index-finance.html'; // url to send the person once authentication is complete
const logoutUrl = baseUrl + 'logout/'; // whitelisted url to send a person who wants to logout
const redirectUri = 'https://cusmorg.ping-eng.com/pfApp/index-finance.html'; // whitelisted url P14C sends the token or code to

const clientId = 'beAPI';

const flowId = getUrlParameter('flowId');

const regexLower = new RegExp('(?=.*[a-z])');
const regexUpper = new RegExp('(?=.*[A-Z])');
const regexNumeric = new RegExp('(?=.*[0-9])');
const regexSpecial = new RegExp('(?=.*[~!@#\$%\^&\*\)\(\|\;\:\,\.\?\_\-])');
const regexLength = new RegExp('(?=.{8,})');

const startSSO = '/idp/startSSO.ping';
const nonce = getNonce();

//PD Values
const pdBaseUrl= 'https://cusmorg.ping-eng.com'


const authorizationUrl =
  baseUrl +
  '/as/authorization.oauth2?client_id=' +
  clientId +
  '&response_type=' +
  responseType +
  '&redirect_uri=' +
  redirectUri +
  '&nonce=' +
  nonce +
  '&scope=' +
  scopes;



// exJax function makes an AJAX call
function exJax(method, url, callback, contenttype, payload) {
  console.log('ajax (' + url + ')');
  console.log("content type in ajax: "+contenttype);
  $.ajax({
      url: url,
      method: method,
      dataType: 'json',
      contentType: contenttype,
      data: payload,
      xhrFields: {
        withCredentials: true
      },
      headers: {
        "X-XSRF-Header": "PingFederate",
        "Accept":"*/*"
      }
    })
    .done(function(data) {
      callback(data);
    })
    .fail(function(data) {
      console.log('ajax call failed');
      console.log(data);
      $('#warningMessage').text(data.responseJSON.details[0].message);
      $('#warningDiv').show();
    });
}



function exJaxPD(method, url, callback, payload) {
  console.log('ajax (' + url + ')');
  $.ajax({
      url: url,
      method: method,
      dataType: 'json',
      contentType: 'application/json',
      data: payload,
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic Y249ZG1hbmFnZXI6MkZlZGVyYXRlTTByZQ=="
      },
    })
    .done(function(data) {
      callback(data);

    })
    .fail(function(data) {
      console.log('ajax call failed');
      console.log(data);
      $('#warningMessage').text(data.responseJSON.details[0].message);
      $('#warningDiv').show();
    });
}


function exJaxPingID(method, url, callback, payload) {
  console.log('ajax (' + url + ')');
  $.ajax({
      url: url,
      method: method,
      dataType: 'json',
      contentType: 'application/json',
      data: payload,
      crossDomain: true,
      headers: {
        "Authorization": "PINGID-HMAC=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImFjY291bnRfaWQiOiI0N2UyODYxNy00YTkwLTQwZTMtOTljZC02MjQyZjk2NmIzZGMiLCJ0b2tlbiI6IjlhYzQyMTZkZmRlYjQ4ODc4MDk5OGRhNGI2OTJhZjM3Iiwiand0X3ZlcnNpb24iOiJ2NCJ9.eyJkYXRhIjoiMTRhNjVkMmY0ZDMwYjE5OGE1OTdlOTc0YjdiY2U5NzE0MjU2ODQzZDAwNGIyNjFmZGIxMmM0NTczMGU3ZGUwNyJ9.EMCwRspDt-BhsY3IO5SFWnmmkahdfXNDIFNzTun3tUs",
        "Content-Type": "application/json"
      },
    })
    .done(function(data) {
      callback(data);

    })
    .fail(function(data) {
      console.log('ajax call failed');
      console.log(data);
      $('#warningMessage').text(data.responseJSON.details[0].message);
      $('#warningDiv').show();
    });
}


function getNonce(){
    console.log('getNonce called');
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var length = 10;
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    console.log('Nonce is ' + text);
    return text;
}


function renderDivState() {
  console.log("renderDiv called");
  console.log(Cookies.get('accessToken'));

  if (Cookies.get('accessToken')) {
    let login = document.getElementById("loginDiv");
    login.style.display = "none";

    let otp = document.getElementById("otpDiv");
    otp.style.display = "none";

    let push = document.getElementById("pushDiv");
    push.style.display = "none";

    let resetpass = document.getElementById("pwResetCodeDiv");
    resetpass.style.display = "none";

    let changePassword = document.getElementById("changePasswordDiv");
    changePassword.style.display = "none";

    let account = document.getElementById("myAccount");
    account.style.display = "block";


  } else {
    let login = document.getElementById("loginDiv");
    login.style.display = "block";

    let otp = document.getElementById("otpDiv");
    otp.style.display = "none";

    let push = document.getElementById("pushDiv");
    login.style.display = "none";

    let changePassword = document.getElementById("changePasswordDiv");
    login.style.display = "none";

    let account = document.getElementById("myAccount");
    account.style.display = "none";
  }


}



// getUrlParameter function parses out the querystring to fetch specific value (e.g., flowId)
function getUrlParameter (parameterName) {
  console.log('getUrlParameter was called ' + parameterName);
  let pageUrl = window.location.href;
  const pound = '#';
  const q = '?';
  const simpleUrl = pageUrl.substring(0, pageUrl.indexOf(pound));
  console.log('simple url: ' + simpleUrl);
  console.log('pageUrl: ' + pageUrl);
  if (pageUrl.includes(pound)) {
    console.log('pageUrl is not null and has #');
    pageUrl = pageUrl.substring(pageUrl.indexOf(pound) + 1);
    console.log('removed base at #:' + pageUrl);
    const urlVariables = pageUrl.split('&');

    console.log('urlVariables: ' + urlVariables);
    for (let i = 0; i < urlVariables.length; i++) {
      const thisParameterName = urlVariables[i].split('=');
      if (thisParameterName[0] === parameterName) {
        console.log('parameterName:' + thisParameterName[1]);
        return thisParameterName[1];
      }
      if (thisParameterName[0].includes('access_token')) {
        console.log('setting at cookie : ' + thisParameterName[1]);
        Cookies.set('accessToken', thisParameterName[1]);
      }
      if (thisParameterName[0].includes('id_token')) {
        console.log('setting id cookie : ' + thisParameterName[1]);
        const idToken = thisParameterName[1];
        Cookies.set('idToken', idToken);
        setUserinfoCookie();
      }

      console.log(thisParameterName);
      console.log('remove AT and IDT from URL');
      window.location.replace(simpleUrl);
    }
  } else if (pageUrl.includes(q)) {
    console.log("pageUrl is not null includes ?");
    pageUrl = pageUrl.substring(pageUrl.indexOf(q)+1);
    console.log("pull attributes after ?:" + pageUrl);
    let urlVariables = pageUrl.split('&');

    console.log("urlVariables: " + urlVariables);
    for (let i = 0; i < urlVariables.length; i++) {
      let thisParameterName = urlVariables[i].split('=');
      if (thisParameterName[0] == parameterName) return thisParameterName[1];
    }
  } else {
    console.log("URLparams are not present");
    return "";
  }
  console.log("getURLParms done");
}

function getFlowId(){
    console.log('getFlowID called');
    let pageUrl = window.location.href;
    return pageUrl.substring(pageUrl.indexOf('=')+1);
}

function getNextStep (flowId){
  console.log('Get next step');
  console.log('flowId is ' + flowId);
  const url = baseUrl +'/pf-ws/authn/flows/'+ flowId;
  console.log('url: ' + url);
  exJax('GET', url, nextStep);

}

function nextStep(data) {

  status = data.status;
  console.log('Parsing json to determine next step: ' + status);

  switch (status) {
    case 'USERNAME_PASSWORD_REQUIRED':
      console.log('Rendering login form');
      $('#loginDiv').show();
      $('#otpDiv').hide();
      $('#pushDiv').hide();
      $('#regDiv').hide();
      $('#changePasswordDiv').hide();
      $('#pwResetCodeDiv').hide();
      $('#idFirst').hide();
      $('#validatePasswordUrl').val(data._links['checkUsernamePassword'].href);
      $('#registerUserUrl').val(data._links['initiateRegistration'].href);
      $('#forgotPasswordURL').val(data._links["initiateAccountRecovery"].href);
      //$('#socialLoginUrl').val(data{"alternativeAuthenticationSources"[0]._links.authenticate.href);
      //$('#partnerLoginUrl').val(data._embedded.socialProviders[1]._links.authenticate.href);
      $('#ppDiv').hide('');
      break;

      case 'IDENTIFIER_REQUIRED':
        console.log('Rendering login form');
        $('#loginDiv').hide();
        $('#otpDiv').hide();
        $('#pushDiv').hide();
        $('#regDiv').hide();
        $('#changePasswordDiv').hide();
        $('#pwResetCodeDiv').hide();
        $('#idFirst').show();
        $('#idSubmitUrl').val(data._links['submitIdentifier'].href);
        //$('#socialLoginUrl').val(data{"alternativeAuthenticationSources"[0]._links.authenticate.href);
        //$('#partnerLoginUrl').val(data._embedded.socialProviders[1]._links.authenticate.href);
        $('#ppDiv').hide('');
        break;

    case 'REGISTRATION_REQUIRED':
    console.log('Rendering Verification code form');
      $('#loginDiv').hide();
      $('#otpDiv').hide();
      $('#pushDiv').hide();
      $('#regDiv').show();
      $('#pwResetCodeDiv').hide();
      $('#changePasswordDiv').hide();
      $('#idFirst').hide();
      $('#registerUserURL').val(data._links['registerUser'].herf);
      $('#cancel').val(data._links['registerUser'].herf);
      $('#ppDiv').hide('');
      break;

    case 'VERIFICATION_CODE_REQUIRED':
      console.log('Rendering Verification code form');
      $('#loginDiv').hide();
      $('#otpDiv').show();
      $('#pushDiv').hide();
      $('#regDiv').hide();
      $('#pwResetCodeDiv').hide();
      $('#changePasswordDiv').hide();
      $('#verifyUserUrl').val(data._links['user.verify'].href);
      $('#ppDiv').hide('');
      $('#idFirst').hide();
      break;
    case 'PASSWORD_REQUIRED':
      console.log('Rendering login form');
      $('#loginDiv').show();
      $('#otpDiv').hide();
      $('#pushDiv').hide();
      $('#regDiv').hide();
      $('#pwResetCodeDiv').hide();
      $('#changePasswordDiv').hide();
      $('#idFirst').hide();
      $('#validatePasswordUrl').val(data._embedded.requiredStep._links['usernamePassword.check'].href);
      $('#ppDiv').hide('');
      break;
    case 'AUTHENTICATION_REQUIRED':
      console.log('Rendering otp form');
      console.log('callPingID');
      callPingID();
      $('#loginDiv').hide();
      $('#otpDiv').show();
      $('#pushDiv').hide();
      $('#regDiv').hide();
      $('#pwResetCodeDiv').hide();
      $('#changePasswordDiv').hide();
      $('#idFirst').hide();
      $('#validateOtpUrl').val(data._links['otp.check'].href);
      $('#ppDiv').hide('');
      break;
    case 'PUSH_CONFIRMATION_REQUIRED':
      console.log('Rendering wait for push form');
      $('#loginDiv').hide();
      $('#otpDiv').hide();
      $('#pushDiv').show();
      $('#regDiv').hide();
      $('#pwResetCodeDiv').hide();
      $('#changePasswordDiv').hide();
      $('#idFirst').hide();
      $('#pushResumeUrl').val(data._links["device.select"].href);
      $('#ppDiv').hide('');
      break;
    case 'MUST_CHANGE_PASSWORD':
      console.log('Rendering password form');
      $('#loginDiv').hide();
      $('#otpDiv').hide();
      $('#pushDiv').hide();
      $('#regDiv').hide();
      $('#pwResetCodeDiv').hide();
      $('#changePasswordDiv').show();
      $('#idFirst').hide();
      $('#changePasswordUrl').val(data._links['password.reset'].href);
      $('#ppDiv').hide('');
      break;
    case 'RECOVERY_CODE_REQUIRED':
    console.log('Rendering password form');
      $('#loginDiv').hide();
      $('#otpDiv').hide();
      $('#pushDiv').hide();
      $('#regDiv').hide();
      $('#changePasswordDiv').hide();
      $('#pwResetCodeDiv').show();
      $('#idFirst').hide();
      $('#changePasswordUrl').val(data._links['password.reset'].href);
      $('#pwcodeUrl').val(data._links['password.recover'].href);
      $('#ppDiv').hide('');
      break;
    case 'COMPLETED':
      console.log('completed authentication successfully');
      $('#loginDiv').hide();
      $('#otpDiv').hide();
      $('#pushDiv').hide();
      $('#regDiv').hide();
      $('#changePasswordDiv').hide();
      $('#pwResetCodeDiv').hide();
      $('#warningMessage').text('');
      $('#warningDiv').hide();
      $('#ppDiv').hide('');
      $('#idFirst').hide();
      console.log('Redirecting user');
      console.log(data);
      window.location.replace(data.resumeUrl);
      break;
    case 'PROFILE_DATA_REQUIRED':
    console.log('rendering PP form');
      $('#loginDiv').hide();
      $('#otpDiv').hide();
      $('#pushDiv').hide();
      $('#regDiv').hide();
      $('#changePasswordDiv').hide();
      $('#pwResetCodeDiv').hide();
      $('#warningMessage').hide('');
      $('#warningDiv').hide();
      $('#ppDiv').text('');
      $('#idFirst').hide();
    break;
    case 'RESUME':
      console.log('resume response.. redirect?');
      $('#loginDiv').hide();
      $('#otpDiv').show();
      $('#pushDiv').hide();
      $('#regDiv').hide();
      $('#pwResetCodeDiv').hide();
      $('#changePasswordDiv').hide();
      $('#idFirst').hide();
      //$('#resumeUrl').val(data._links['self'].href);
      $('#ppDiv').hide('');
      window.location.replace(data.resumeUrl);
      break;
    default:
      console.log('Unexpected outcome');
      break;
  }
}


function getRegStatus(){
  console.log('start Reg process called');
  let url = $('#registerUserUrl').val();
  //let url = 'https://test.com';
  console.log('url is: ' + url);
  let content = 'application/vnd.pingidentity.initiateRegistration+json';
  console.log('Content is '+ content);
  exJax('POST', url, nextStep, content);
}

function userReg(){
  console.log('Register user called');
  let payload = JSON.stringify({
    "password": $('#user_password').val(),
    "fieldValues": {
      username: $('#username').val(),
      fullName: $('#fname').val() + ' ' + $('#lname').val(),
      lastName: $('#lname').val(),
      lastName: $('#fname').val(),
      email: $('#username').val(),
      phoneNumber: $('#phone').val()
    },
  });
  console.log('payload is ' + payload);
  let url = $('#registerUserUrl').val();
  console.log('url is: ' + url);
  let content = 'application/vnd.pingidentity.registerUser+json';
  console.log('Content is '+ content);
  exJax('POST', url, nextStep, content, payload);

}

function validatePassword(){
  console.log('validatePassword called');
  let payload = JSON.stringify({
    username: $('#user_login').val(),
    password: $('#user_pass').val()
  });
  console.log('payload is ' + payload);
  let url = $('#validatePasswordUrl').val();
  console.log('url is: ' + url);
  let content = 'application/vnd.pingidentity.checkUsernamePassword+json';
  console.log('Content is '+ content);
  exJax('POST', url, nextStep, content, payload);
}

function submitID(){
  console.log('submitID called');
  let payload = JSON.stringify({
    username: $('#username').val(),
  });
  console.log('payload is ' + payload);
  let url = $('#idSubmitUrl').val();
  console.log('url is: ' + url);
  let content = 'application/vnd.pingidentity.submitIdentifier+json';
  console.log('Content is '+ content);
  exJax('POST', url, nextStep, content, payload);
}










///Other stuff that's not authentication/Register

function callPingID(){
  console.log('PingID called');
  let user = $('#user_login').val();
  let url = 'https://sdk.pingid.com/pingid/v1/accounts/47e28617-4a90-40e3-99cd-6242f966b3dc/applications/74b5cc6f-576e-4b47-8bb7-4f7e8806f503/users' + user + '/authentications/'
  let payload = JSON.stringify({
    authenticationType:"AUTHENTICATE",
    emailConfigurationType:"auth_without_payload",
    smsMessage:"Please enter this code to authenticate - ",
    pushMessageTitle:"Request from Customer Service",
    pushMessageBody:"Please verify your authentication",
    voiceMessage:"Your authentication code is: ${OTP}"
  });
  console.log('PingID url' + url);
  console.log('PingID payload: ' + payload);

  exJaxPingID('POST', url, nextStep, content, payload);
}


function verifyEmail(conStat){
  console.log('verifyEmail called');
  let userEmail=$('#user_email').val();
  let url = pdBaseUrl+'/directory/v1/ou=people,dc=customer360.com/subtree?searchScope=wholeSubtree&filter=mail eq "'+ userEmail + '"';
  exJaxPD('GET', url, userEmailNextSteps);
}

function createEmailUser(){
  let url = 'https://' + pdBaseUrl +'/directory/v1/';
  let userEmail=$('#user_email').val();
  let dn = 'uid='+userEmail+',ou=People,dc=customer360.com';
  console.log('userDN=' + dn);
  let payload = JSON.stringify({
    _dn:dn,
    objectClass:['inetOrgPerson'],
    sn:['default'],
    cn:['defualt'],
    uid:[userEmail],
    mail:[userEmail]
  });
  console.log('payload is ' + payload);
  exJaxPD('POST', url, userEmailNextSteps, payload);
}

function getConsent(){
  console.log('Get consents');
  let url = pdBaseUrl +'/consent/v1/definitions';
  exJaxPD('GET',url, consentFlow);
}


function userEmailNextSteps(data) {
  status = data.size;
  console.log('Parsing json to determine next step: ' + status);

  switch (status) {
    case '0':
      console.log('user not found');
      createEmailUser();
      break;

    case'1':
    console.log('user exisits in Dir calling getUserConsents');
    getUserConsents();
    break;

    default:
      console.log('No size need to check for user again, calling VerifyEmail');
      verifyEmail();
      break;

    }
}

function initialAcceptConsent(){
  console.log('initialAcceptConsent called');
  let url = pdBaseUrl +  '/consent/v1/consents';
  let email = $('#user_email').val();
  let payload = JSON.stringify({
   status:'accepted',
   subject:email,
   actor:email,
   audience:"app1",
   definition:{"id":"App1-MarketingPrefs","version":"1.0","locale":"us-EN"},
   dataText:"Your Email address(es) or SMS number(s)",
   purposeText:"This data is used to send you relevent News and Offers"
 });
 console.log('initialAcceptConsent payload: ' + payload);
  exJaxPD('POST', url, consentFlow, payload);
}

function getUserConsents(){
  let email = $('#user_email').val();
  console.log('email is: ' + email);
  let url = pdBaseUrl + '/consent/v1/consents?subject='+ email;

  exJaxPD('GET', url, consentFlow);

}

function consentFlow(data){
  console.log('consentFlow data: '+ data);
  status = data.size;
  //let consentStatus =_embedded.consents.[0].status;
  //console.log('Consent stat: 'consentStatus);

  console.log('ConsentFlow parsing json to determine next step: ' + status);
  switch (status) {
    case '0':
    console.log('no consents');
    console.log('Create accepted consent');
      initialAcceptConsent('accepted');
    break;

    case '1':
    $('#consentStatus').val(data._embedded.consents[0].status);
    $('#consentID').val(data._embedded.consents[0].id);
    $('#consentText').val(data._embedded.consents[0].purposeText);
    console.log('1 consent exists');
    let consentStatus = $('#consentStatus').val();
    console.log('case 1 conStat :' + consentStatus);
    updateConsent('accepted');
    break;

    default:
    console.log('no size check again');
    getUserConsents();
    break;
  }
}

function showConsents(data){
  console.log('showConsents called');
  $('#consentStatus').val(data.status);
  $('#consentID').val(data.id);
  $('#consentText').val(data.purposeText);

  let  consentStatus= $('#consentStatus').val();
  console.log('status: '+ consentStatus);
}


function updateConsent(conStat){
  console.log('updateConsent called');
  let consentID = $('#consentID').val();
  console.log('updateConsent consentID is: ' + consentID );
  let url = pdBaseUrl +  '/consent/v1/consents/' + consentID;
  console.log('updateConurl: ' +url);
  let payload = JSON.stringify({
    status:conStat
  });
 console.log('UpdateConsent payload: ' + payload);
  exJaxPD('PATCH', url, showConsents, payload);

}
