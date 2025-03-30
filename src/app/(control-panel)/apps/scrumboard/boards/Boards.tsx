'use client';

import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import FuseLoading from '@fuse/core/FuseLoading';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import BoardItem from './BoardItem';
import NewBoardItem from './NewBoardItem';
import { useGetScrumboardBoardsQuery } from '../ScrumboardApi';

/**
 * The Scrumboard boards component.
 */
function Boards() {
	const { data: boards, isLoading } = useGetScrumboardBoardsQuery();

	const container = {
		show: {
			transition: {
				staggerChildren: 0.04
			}
		}
	};

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 }
	};

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<div className="flex grow shrink-0 flex-col items-center container p-6 sm:p-10">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
			>
				<div className="flex flex-col mt-4 md:mt-24">
					<PageBreadcrumb className="justify-center mb-2" />
					<Typography className="text-3xl md:text-6xl font-extrabold tracking-tight leading-7 sm:leading-10 text-center">
						Scrumboard Boards
					</Typography>
				</div>
			</motion.div>

			<motion.div
				variants={container}
				initial="hidden"
				animate="show"
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 md:mt-16"
			>
				{boards?.map((board) => (
					<motion.div
						variants={item}
						className="min-w-full sm:min-w-56 min-h-90"
						key={board.id}
					>
						<BoardItem
							board={board}
							key={board.id}
						/>
					</motion.div>
				))}

				<motion.div
					variants={item}
					className="min-w-full sm:min-w-56 min-h-90"
				>
					<NewBoardItem />
				</motion.div>
			</motion.div>
		</div>
	);
}

export default Boards;
