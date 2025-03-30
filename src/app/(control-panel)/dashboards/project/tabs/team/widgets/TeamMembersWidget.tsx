import Typography from '@mui/material/Typography';
import { memo } from 'react';
import Paper from '@mui/material/Paper';
import { motion } from 'motion/react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import { useGetProjectDashboardWidgetsQuery } from '../../../ProjectDashboardApi';
import TeamMemberType from './types/TeamMemberType';

/**
 * The TeamMembersWidget widget.
 */
function TeamMembersWidget() {
	const { data: widgets, isLoading } = useGetProjectDashboardWidgetsQuery();
	const members = widgets?.teamMembers as TeamMemberType[];

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!members) {
		return null;
	}

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

	return (
		<motion.div
			variants={container}
			initial="hidden"
			animate="show"
			className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full min-w-0"
		>
			{members.map((member) => (
				<Paper
					component={motion.div}
					variants={item}
					className="flex flex-col flex-auto items-center shadow-sm rounded-xl overflow-hidden"
					key={member.id}
				>
					<div className="flex flex-col flex-auto w-full p-8 text-center">
						<div className="w-32 h-32 mx-auto rounded-full overflow-hidden">
							<img
								className="w-full h-full object-cover"
								src={member.avatar}
								alt="member"
							/>
						</div>
						<Typography className="mt-6 font-medium">{member.name}</Typography>
						<Typography color="text.secondary">{member.title}</Typography>
					</div>
					<div className="flex items-center w-full border-t divide-x">
						<a
							className="flex flex-auto items-center justify-center py-4 hover:bg-hover"
							href={`mailto:${member.email}`}
							role="button"
						>
							<FuseSvgIcon
								size={20}
								color="action"
							>
								heroicons-solid:envelope
							</FuseSvgIcon>
							<Typography className="ml-2">Email</Typography>
						</a>
						<a
							className="flex flex-auto items-center justify-center py-4 hover:bg-hover"
							href={`tel${member.phone}`}
							role="button"
						>
							<FuseSvgIcon
								size={20}
								color="action"
							>
								heroicons-solid:phone
							</FuseSvgIcon>
							<Typography className="ml-2">Call</Typography>
						</a>
					</div>
				</Paper>
			))}
		</motion.div>
	);
}

export default memo(TeamMembersWidget);
