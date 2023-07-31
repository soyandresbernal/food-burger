import Link from 'next/link';
import React from 'react';

const Footer = () => {
	return (
		<footer className='h-12 md:h-24 p-4 lg:px-20 xl:px-40 text-red-500 flex items-center justify-between'>
			<Link href='/'>
				<a className='font-bold text-xl' aria-label='Food Burguer'>
					Food Burguer
				</a>
			</Link>
			<p>&copy; ALL RIGHTS RESERVED.</p>
		</footer>
	);
};

export default Footer;
