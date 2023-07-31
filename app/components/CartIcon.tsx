import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const CartIcon = () => {
	return (
		<Link href='/cart'>
			<a className='flex items-center gap-4'>
				<div className='relative w-8 h-8 md:w-5 md:h-5'>
					<Image src='/cart.png' alt='Shopping Cart' width={24} height={24} />
				</div>
				<span>Cart (3)</span>
			</a>
		</Link>
	);
};

export default CartIcon;
