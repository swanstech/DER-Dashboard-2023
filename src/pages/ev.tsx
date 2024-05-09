import React from 'react';

const EV: React.FC = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>EV Management System</h1>
      </header>
      <section style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ flex: '1', marginRight: '20px' }}>
          <h2>Smappee Integration</h2>
          <iframe 
            src="https://dashboard.smappee.net/login" 
            title="StormCloud Integration" 
            allow="fullscreen"
            style={{ border: '0', width: '100%', height: '600px' }}>
          </iframe>
        </div>
        
      </section>

      <section style={{ display: 'flex', justifyContent: 'space-between' }}>
       
        <div style={{ flex: '1' }}>
          <h2>Growatt Integration</h2>
          <iframe 
            src="https://server.growatt.com/login" 
            title="Growatt Integration" 
            allow="fullscreen"
            style={{ border: '0', width: '100%', height: '600px' }}>
          </iframe>
        </div> 
      </section>
    </div>
  );
}

export default EV;
