import '@/styles/globals.css';
import { Geist, Geist_Mono, Inter, Montserrat, Poppins } from 'next/font/google';
import localFont from 'next/font/local';
import ClientWrapper from '@/components/ClientWrapper';
import { HeroUIProvider } from '@heroui/react';
import DynamicHelpButton from '@/components/shared/DynamicHelpButton';

export const metadata = {
  title: 'Khelverse',
  description: 'Khelverse App',
  viewport: 'width=device-width, initial-scale=1.0',
  // viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
};

// Font setup
const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
});
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
});

const sprintura = localFont({
  src: '../fonts/sprintura-demo.regular.otf',
  variable: '--font-sprintura',
  weight: '900',
});
const thuast = localFont({
  src: '../fonts/thuast.demo.otf',
  variable: '--font-thuast',
  weight: '900',
});
const mindglow = localFont({
  src: '../fonts/mind-glow.regular.ttf',
  variable: '--font-mindglow',
  weight: '700',
});
const onfarming = localFont({
  src: '../fonts/on-farming.regular.ttf',
  variable: '--font-onfarming',
  weight: '500',
});

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head>
        <meta
          name='viewport'
          content='width=1280, initial-scale=1.0, maximum-scale=1.0,user-scalable=no, shrink-to-fit=yes'
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${poppins.variable} ${montserrat.variable} ${sprintura.variable} ${thuast.variable} ${mindglow.variable} ${onfarming.variable} antialiased`}
      >
        <HeroUIProvider>
          <ClientWrapper>{children}
            <DynamicHelpButton/>
          </ClientWrapper>
        </HeroUIProvider>
      </body>
    </html>
  );
}
