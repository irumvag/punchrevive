import CertificateGenerator from './CertificateGenerator';

/**
 * Example usage of CertificateGenerator component
 */
export default function CertificateGeneratorExample() {
  return (
    <div style={{ padding: '2rem', background: '#000000', minHeight: '100vh' }}>
      <h1 style={{ 
        fontFamily: 'Creepster, cursive', 
        color: '#0f0', 
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        Certificate Generator Example
      </h1>

      {/* FORTRAN to Python */}
      <CertificateGenerator
        originalLanguage="FORTRAN"
        targetLanguage="Python"
        resurrectionDate={new Date('2024-10-31')}
        cardId="abc123-def456-ghi789"
      />

      {/* COBOL to JavaScript */}
      <div style={{ marginTop: '3rem' }}>
        <CertificateGenerator
          originalLanguage="COBOL"
          targetLanguage="JavaScript"
          resurrectionDate={new Date()}
          cardId="xyz987-uvw654-rst321"
        />
      </div>

      {/* BASIC to Python */}
      <div style={{ marginTop: '3rem' }}>
        <CertificateGenerator
          originalLanguage="BASIC"
          targetLanguage="Python"
          resurrectionDate={new Date('2024-12-25')}
          cardId="pqr111-mno222-jkl333"
        />
      </div>
    </div>
  );
}
