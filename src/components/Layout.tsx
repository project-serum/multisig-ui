import React, { useState, PropsWithChildren } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Header from './Header';
import Footer from './Footer';

type Props = {};

export default function Layout(props: PropsWithChildren<Props>) {
  const [refresh, setRefresh] = useState(false);
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
        backgroundColor: 'rgb(251, 251, 251)',
      }}
    >
      <div
        style={{
          position: 'fixed',
          width: '100%',
          zIndex: 99,
        }}
      >
        <RiskBar />
        <Header />
      </div>
      <div
        style={{
          width: '100%',
          marginTop: '94px',
          flex: 1,
          display: 'flex',
          marginBottom: '30px', // Compensates for the fixed position footer.
        }}
      >
        {window.localStorage.getItem('consent') ? (
          <div style={{ width: '100%' }}>{props.children}</div>
        ) : (
          <RiskDisclosureForm
            onConsent={() => {
              window.localStorage.setItem('consent', 'true');
              setRefresh(!refresh);
            }}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

function RiskBar() {
  return (
    <div
      style={{
        color: '#fff',
        backgroundColor: 'rgb(39, 39, 39)',
        height: '30px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Typography style={{ fontSize: '14px' }}>
          Multisig is unaudited software. Use at your own risk.
        </Typography>
      </div>
    </div>
  );
}

function RiskDisclosureForm({ onConsent }: { onConsent: () => void }) {
  return (
    <div
      style={{
        flex: '1',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <div style={{ width: '100%', display: 'flex' }}>
        <div
          style={{ display: 'flex', marginLeft: 'auto', marginRight: 'auto' }}
        >
          <Typography
            style={{ marginBottom: '16px', maxWidth: '1000px' }}
            color="textSecondary"
            variant="h4"
          >
            No statement or warranty is provided in relation to the utility of
            this program, the safety of its code or its suitability for your
            use, and by using it, you agree to bear any risk associated with
            such potential vulnerabilities, including, but not limited to the
            potential loss of tokens.
          </Typography>
        </div>
      </div>
      <div style={{ display: 'flex', marginLeft: 'auto', marginRight: 'auto' }}>
        <Button variant="contained" color="primary" onClick={onConsent}>
          I agree
        </Button>
      </div>
    </div>
  );
}
