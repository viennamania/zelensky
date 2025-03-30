import { useParams } from 'next/navigation';
import _ from 'lodash';
import { useGetMailboxFoldersQuery, useGetMailboxLabelsQuery, useGetMailboxMailsQuery } from '../MailboxApi';

function useGetMails() {
	const { mailParams } = useParams<{ mailParams: string[] }>();
	const [category, subCategory] = mailParams;
	const { data: folders } = useGetMailboxFoldersQuery();
	const { data: labels } = useGetMailboxLabelsQuery();

	let queryParams = {};

	if (category === 'folders') {
		const folderId = _.find(folders, { slug: subCategory })?.id;
		queryParams = { folder: folderId };
	} else if (category === 'filters') {
		queryParams = { [subCategory]: true };
	} else if (category === 'labels') {
		const labelId = _.find(labels, { slug: subCategory })?.id;
		queryParams = { labels: labelId };
	}

	return useGetMailboxMailsQuery(queryParams);
}

export default useGetMails;
