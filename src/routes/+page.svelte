<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import supabase from '$lib/db';
	import Grid from '$lib/Grid.svelte';
	import { El, Input, Button } from '@ubeac/svelte';
	import { accountStore } from '$lib/stores';
	import '@ubeac/svelte/styles/tabler.css';

	/**
	 * @type {never[] | null}
	 */
	export let accounts = [];
	let newAccount = '';

	onMount(async () => {
		await getAllaccounts();
	});

	const addNewAccount = async (newAccount) => {
		try {
			const { data, error } = await supabase
				.from('Accounts')
				.insert([{ account_name: newAccount }]);
			await getAllaccounts();
			newAccount = '';
		} catch (err) {
			console.log(err);
		}
	};
	const getAllaccounts = async () => {
		try {
			let { data, error } = await supabase
				.from('Accounts')
				.select('*')
				.order('updated_at', { ascending: true })
				.limit(1300);
			// @ts-ignore
			accountStore.set(data);
		} catch (err) {
			console.log(err);
		}
	};

	const handleKeyPress = (/** @type {{ key: string; }} */ event) => {
		if (event.key === 'Enter' && newAccount !== '') {
			addNewAccount();
		}
	};
</script>

<div class="add-account">
	<Input type="text" bind:value={newAccount} style="width:20%;" />
	<Button on:click={() => addNewAccount(newAccount)}>Add Account</Button>
</div>

{#if accounts !== null}
	<Grid accounts={$accountStore} />
{/if}

<style>
	.add-account {
		display: flex;
		margin-bottom: 0.5em;
	}

	:global(.switch) {
		color: lightskyblue;
		cursor: pointer;
	}

	:global(.switch:hover) {
		text-decoration: underline;
	}
</style>
