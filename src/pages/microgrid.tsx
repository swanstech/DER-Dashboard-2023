import React from 'react';

const Microgrid: React.FC = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Microgrid Management System</h1>
      </header>
      <section style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ flex: '1', marginRight: '20px' }}>
          <h2>StormCloud Integration</h2>
          <iframe 
            src="https://pwa.switchdin.com/account/login" 
            title="StormCloud Integration" 
            allow="fullscreen"
            style={{ border: '0', width: '100%', height: '600px' }}>
          </iframe>
        </div>
        <div style={{ flex: '1' }}>
          <h2>Powerplus Integration</h2>
          <iframe 
            src="https://web.powerplus.com/genportal/login.aspx" 
            title="Wallbox Integration" 
            allow="fullscreen"
            style={{ border: '0', width: '100%', height: '600px' }}>
          </iframe>
        </div> 
      </section>
    </div>
  );
}

export default Microgrid;
