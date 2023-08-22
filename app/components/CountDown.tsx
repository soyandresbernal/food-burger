//here
import React, { useState, useEffect, useCallback, useMemo } from 'react';

const CountDown = () => {
	const targetDate = useMemo(() => new Date('10/10/2023'), []);

	const calculateRemainingTime = useCallback(() => {
		const difference = +targetDate - +new Date();
		const days = Math.floor(difference / (1000 * 60 * 60 * 24));
		const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
		const minutes = Math.floor((difference / (1000 * 60)) % 60);
		const seconds = Math.floor((difference / 1000) % 60);

		return {
			days,
			hours,
			minutes,
			seconds
		};
	}, [targetDate]);

	const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());

	useEffect(() => {
		const timer = setInterval(() => {
			setRemainingTime(calculateRemainingTime());
		}, 1000);

		return () => {
			clearInterval(timer);
		};
	}, [calculateRemainingTime]);

	return (
		<div>
			<span className='font-bold text-5xl text-yellow-300' aria-live='polite'>
				{remainingTime.days} days, {remainingTime.hours} hours,{' '}
				{remainingTime.minutes} minutes, {remainingTime.seconds} seconds
			</span>
		</div>
	);
};

export default CountDown;
