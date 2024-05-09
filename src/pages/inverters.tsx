import React from 'react';

const Inverters: React.FC = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Inverter Management System</h1>
      </header>
      <section style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ flex: '1', marginRight: '20px' }}>
          <h2>Fronius Integration</h2>
          <iframe 
            src="https://login.fronius.com/authenticationendpoint/login.do?client_id=mf_o9iTAyKemNLQTa6Sp6HYonCIa&commonAuthCallerPath=%2Foauth2%2Fauthorize&forceAuth=false&nonce=638506766918325527.YTJlZThjYTQtNzBlMi00NTUwLWFkZDAtZGI3NDEwMzQyMTcxZGU2YjEwNmYtZGQyMi00Njk4LTg1NWYtNTY4OTRjZTNlMDY5&passiveAuth=false&redirect_uri=https%3A%2F%2Fwww.solarweb.com%2FAccount%2FExternalLoginCallback&response_mode=form_post&response_type=code+id_token&scope=openid+profile+solarweb+solweb_browserid_93c65d8e866a6421e43a4e3d7b75f200&state=OpenIdConnect.AuthenticationProperties%3DQbYjAHFY-AJOCuf9EE5MFGDfMw318DVGMLqz_izG-kTnUVYb5smwhdOUVYhND1G2Po3Ee31mHL4ISS0L2E3JHWPByXXeUuMlGTBgM0CBlCvl5p4mqhf9giNP6PdTLOe1GImUZDgyuF_N9U--pFU-6lMHTt56j0lF4Oh5r2y4tK4KirUQhKZYv7GKio85oGj1AhmqV1JiWlYxC2GFMpH3IkYAvmMmBG37USd2-f1xrEY3fM_DYAjJUhzMRcFpnc9YPBNsH1pxpMg1EpE2c-ThMyRWnYI&tenantDomain=carbon.super&x-client-SKU=ID_NET461&x-client-ver=6.9.0.0&sessionDataKey=a2fb6ca4-e7bd-4b1d-84c9-66defce0f8df&relyingParty=mf_o9iTAyKemNLQTa6Sp6HYonCIa&type=oidc&sp=Solar.web+-+Portals&isSaaSApp=false&authenticators=SAMLSSOAuthenticator%3AFronius+Login%3BFroniusBasicAuthenticator%3ALOCAL" 
            title="Fronius Integration" 
            allowFullScreen
            style={{ border: '0', width: '100%', height: '600px' }}>
          </iframe>
        </div>
      </section>
    </div>
  );
}

export default Inverters;
