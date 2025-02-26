import {
  Html,
  Text,
  Section,
  Container,
  Button,
  Img,
  Hr,
  Head,
} from '@react-email/components';

interface NewsletterEmailProps {
  name: string;
}

export default function NewsletterEmail({ name }: NewsletterEmailProps) {
  return (
    <Html>
      <Head />
      <Section style={main}>
        <Container style={container}>
          <Img
            src="https://econecta.io/logo.png"
            width="350"
            height="106"
            alt="Econecta"
            style={logo}
          />
          <Text style={heading}>¡Hola {name}!</Text>
          
          <Text style={paragraph}>
            Gracias por unirte a la comunidad de Econecta. Sabemos que tu tiempo es valioso, así que prometemos enviarte solo lo mejor: consejos útiles, novedades tecnológicas y oportunidades exclusivas para hacer crecer tu negocio.
          </Text>

          <Text style={paragraph}>
            Para que empieces con el pie derecho, queremos darte un 15% de descuento en tu primera compra de un perfil digital.
          </Text>

          <Section style={couponContainer}>
            <Text style={couponCode}>MAILER15OFF</Text>
            <Text style={couponText}>Usa este código al momento de tu compra</Text>
          </Section>

          <Text style={subheading}>¿Cómo puede ayudarte Econecta en tu día a día?</Text>
          
          <Text style={listItem}>✅ Compartes toda tu información profesional con un solo toque.</Text>
          <Text style={listItem}>✅ Te olvidas de las tarjetas de papel (más ecológico y económico).</Text>
          <Text style={listItem}>✅ Captas y gestionas contactos automáticamente.</Text>
          <Text style={listItem}>✅ Optimizas tu presencia en eventos y reuniones de negocios.</Text>

          <Text style={paragraph}>
            Esto es solo el comienzo. Estamos aquí para hacerte la vida más fácil, más digital y más eficiente.
          </Text>

          <Button style={button} href="https://econecta.io">
            Activa tu descuento ahora
          </Button>

          <Text style={paragraph}>
            Gracias por confiar en nosotros. ¡Nos vemos pronto en tu bandeja de entrada (pero sin ser pesados, lo prometemos)! 😉
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            El equipo de Econecta<br />
            📍 Caracas, Venezuela<br />
            🌐 econecta.io
          </Text>
        </Container>
      </Section>
    </Html>
  );
}

// Estilos
const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};

const logo = {
  margin: '0 auto',
  marginBottom: '24px',
};

const heading = {
  fontSize: '30px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#484848',
  textAlign: 'center' as const,
};

const subheading = {
  fontSize: '20px',
  lineHeight: '1.3',
  fontWeight: '600',
  color: '#484848',
  marginTop: '24px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#484848',
  marginBottom: '16px',
};

const listItem = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#484848',
  marginBottom: '8px',
};

const couponContainer = {
  backgroundColor: '#f3f4f6',
  borderRadius: '5px',
  padding: '20px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const couponCode = {
  fontSize: '32px',
  color: '#1d4ed8',
  fontWeight: '700',
  margin: '0',
};

const couponText = {
  fontSize: '14px',
  color: '#6b7280',
  marginTop: '8px',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
  margin: '24px 0',
};

const hr = {
  borderColor: '#e5e5e5',
  margin: '24px 0',
};

const footer = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#9ca3af',
  textAlign: 'center' as const,
}; 