<script>
	// @ts-nocheck

	import { onMount, afterUpdate } from 'svelte';

	import * as agGrid from 'ag-grid-community';
	import 'ag-grid-community/styles/ag-grid.css';
	import 'ag-grid-community/styles/ag-theme-material.css';

	import supabase from '$lib/db';

	//import { AutocompleteSelectCellEditor } from 'ag-grid-autocomplete-editor';

	import 'ag-grid-autocomplete-editor/dist/main.css';

	export let accounts = [];
	export const states = [
		'AL',
		'AK',
		'AZ',
		'AR',
		'CA',
		'CO',
		'CT',
		'DE',
		'DC',
		'FL',
		'GA',
		'HI',
		'ID',
		'IL',
		'IN',
		'IA',
		'KS',
		'KY',
		'LA',
		'ME',
		'MD',
		'MA',
		'MI',
		'MN',
		'MS',
		'MO',
		'MT',
		'NE',
		'NV',
		'NH',
		'NJ',
		'NM',
		'NY',
		'NC',
		'ND',
		'OH',
		'OK',
		'OR',
		'PA',
		'RI',
		'SC',
		'SD',
		'TN',
		'TX',
		'UT',
		'VT',
		'VA',
		'WA',
		'WV',
		'WI',
		'WY',
		'AB',
		'BC',
		'MB',
		'NB',
		'NL',
		'NS',
		'NT',
		'NU',
		'ON',
		'PE',
		'QC',
		'SK',
		'YT',
		'AS',
		'GU',
		'MP',
		'PR',
		'VI',
		'FM',
		'MH',
		'PW',
		'AA',
		'AE',
		'AP',
		'N/A'
	];

	let gridContainer;
	let gridApi;

	const columnDefs = [
		{
			field: 'updated_at',
			headerName: 'Last Updated',
			sort: 'desc',
			valueFormatter: (params) => {
				return prettyPrintLocalTime(params.value);
			}
		},
		{
			field: 'account_name',
			headerName: 'Account Name',
			editable: true,
			cellEditor: 'agTextCellEditor',
			cellEditorParams: {
				useFormatter: true,
				maxLength: 200
			}
		},
		{ field: 'account_street', headerName: 'Address' },
		{ field: 'account_city', headerName: 'City' },
		{
			field: 'account_state_abbr',
			headerName: 'State',
			editable: true
			// cellEditor: AutocompleteSelectCellEditor,
			// cellEditorParams: {
			// 	selectData: [
			// 		{ label: 'Canada', value: 'CA', group: 'North America' },
			// 		{ label: 'United States', value: 'US', group: 'North America' },
			// 		{ label: 'Uzbekistan', value: 'UZ', group: 'Asia' }
			// 	],
			// 	placeholder: 'Select an option'
			// }
		},
		{ field: 'account_zip_code', headerName: 'Zip' },
		{ field: 'account_phone_number', headerName: 'Phone' },
		{ field: 'id', headerName: 'ID' }
	];

	const gridOptions = {
		columnDefs: columnDefs,
		rowData: accounts,
		defaultColDef: {
			sortable: true,
			filter: true,
			resizable: true
		},
		onGridReady: (params) => {
			gridApi = params.api;
		},
		onRowEditingStarted: (event) => {
			console.log('never called - not doing row editing');
		},
		onRowEditingStopped: (event) => {
			console.log('never called - not doing row editing');
		},
		onCellEditingStarted: (event) => {
			console.log('cellEditingStarted');
		},
		onCellEditingStopped: (event) => {
			console.log('cellEditingStopped');
			updateAccount(event.data);
		}
	};

	onMount(() => {
		new agGrid.Grid(gridContainer, gridOptions);
	});

	const getStates = async () => {
		const { data, error } = await supabase.from('States').select('*');
		if (error) {
			console.log(error);
		} else {
			console.log(data);
			return data.state_abbr;
		}
	};

	afterUpdate(() => {
		if (gridApi) {
			gridApi.setRowData(accounts);
		}
	});

	const prettyPrintLocalTime = (isoTimestamp) => {
		const localTime = new Date(isoTimestamp);
		const dateFormatter = new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		});
		const timeFormatter = new Intl.DateTimeFormat('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: true
		});

		const formattedDate = dateFormatter.format(localTime);
		const formattedTime = timeFormatter.format(localTime);

		return `${formattedDate} ${formattedTime}`;
	};

	// create updateAccount function
	const updateAccount = async (account) => {
		console.log('updateAccount', account);
		try {
			const { data, error } = await supabase.from('Accounts').update(account).eq('id', account.id);
			// await getAllaccounts();
		} catch (err) {
			console.log(err);
		}
	};
</script>

{#if accounts !== null && typeof accounts !== 'undefined'}
	<div
		id="datagrid"
		class="ag-theme-material"
		style="height: 600px; width:1350px;"
		bind:this={gridContainer}
	/>
	<p>{accounts.length}</p>
{:else}
	<p>Loading........</p>
{/if}

<style>
	#datagrid {
		--ag-header-foreground-color: dodgerblue;
	}
	:global(.ag-header-cell) {
		background: rgb(221, 222, 230);
		font-size: 16px;
	}
</style>
