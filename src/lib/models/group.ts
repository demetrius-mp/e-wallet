type FetchedGroup = {
	id: number;
	name: string;
};

export async function fetchGroups(query: string): Promise<FetchedGroup[]> {
	const response = await fetch(`/app/api/groups?search=${query}`);
	const json = await response.json();

	return json.groups;
}
