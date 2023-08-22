import { Inter } from 'next/font/google';
import Notification from './components/Notification';
import './global.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'Food Burguer',
	description: 'Best app for burgers'
};

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<Notification />
				<Navbar />
				{children}
				<Footer />
			</body>
		</html>
	);
}
