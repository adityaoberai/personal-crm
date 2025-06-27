<script>
	import { onMount } from 'svelte';
	import '../app.css';

	let contacts = [];
	let editingContacts = [];
	let loading = false;
	let saving = false;

	// Initialize with one empty row for new contacts
	function initializeEmptyRows() {
		const emptyRow = {
			name: '',
			email: '',
			phone: '',
			notes: '',
			isNew: true,
			isModified: false
		};
		editingContacts = [
			...contacts.map((c) => ({ ...c, isNew: false, isModified: false })),
			emptyRow
		];
	}

	// Load all contacts
	async function loadContacts() {
		loading = true;
		try {
			const response = await fetch('/api/contacts');
			if (response.ok) {
				contacts = await response.json();
				initializeEmptyRows();
			} else {
				console.error('Failed to load contacts');
			}
		} catch (error) {
			console.error('Error loading contacts:', error);
		}
		loading = false;
	}

	// Mark a contact as modified
	function markAsModified(index) {
		editingContacts[index].isModified = true;
		editingContacts = [...editingContacts];
	}

	// Add one more empty row
	function addMoreRows() {
		const newRow = {
			tempId: `temp_${Date.now()}`,
			name: '',
			email: '',
			phone: '',
			notes: '',
			isNew: true,
			isModified: false
		};
		editingContacts = [...editingContacts, newRow];
	}

	// Save all changes (batch upsert)
	async function saveAllChanges() {
		saving = true;
		try {
			// Filter out empty rows and get only modified/new contacts
			const contactsToSave = editingContacts
				.filter((contact) => {
					return (
						(contact.isModified || contact.isNew) && contact.name.trim() && contact.email.trim()
					);
				})
				.map((contact) => {
					const { tempId, isNew, isModified, ...contactData } = contact;
					return contactData;
				});

			if (contactsToSave.length === 0) {
				alert('No changes to save or missing required fields (name, email)');
				saving = false;
				return;
			}

			const response = await fetch('/api/contacts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ contacts: contactsToSave })
			});

			if (response.ok) {
				await loadContacts();
				alert(`Successfully saved ${contactsToSave.length} contact(s)!`);
			} else {
				const error = await response.json();
				alert(`Failed to save contacts: ${error.error}`);
			}
		} catch (error) {
			console.error('Error saving contacts:', error);
			alert('Error saving contacts. Please try again.');
		}
		saving = false;
	}

	// Delete a contact
	async function deleteContact(contact, index) {
		if (contact.isNew) {
			// Just remove from the array if it's a new unsaved contact
			editingContacts.splice(index, 1);
			editingContacts = [...editingContacts];
			return;
		}

		if (!confirm(`Are you sure you want to delete ${contact.name}?`)) {
			return;
		}

		try {
			const response = await fetch('/api/contacts', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ id: contact.$id })
			});

			if (response.ok) {
				await loadContacts();
			} else {
				console.error('Failed to delete contact');
			}
		} catch (error) {
			console.error('Error deleting contact:', error);
		}
	}

	// Reset all changes
	function resetChanges() {
		if (confirm('Are you sure you want to reset all unsaved changes?')) {
			initializeEmptyRows();
		}
	}

	// Count modified contacts
	$: modifiedCount = editingContacts.filter(
		(c) => c.isModified || (c.isNew && (c.name.trim() || c.email.trim()))
	).length;

	onMount(loadContacts);
</script>

<svelte:head>
	<title>Personal CRM</title>
</svelte:head>

<div class="container">
	<header>
		<h1>📊 Personal CRM Spreadsheet</h1>
		<p>Edit multiple contacts at once</p>
	</header>

	<!-- Control Panel -->
	<section class="control-panel">
		<div class="stats">
			<span class="stat">Total Contacts: {contacts.length}</span>
			<span class="stat modified">Modified: {modifiedCount}</span>
		</div>
		<div class="actions">
			<button on:click={addMoreRows} class="btn-secondary"> + Add Row </button>
			<button on:click={resetChanges} class="btn-cancel" disabled={modifiedCount === 0}>
				Reset Changes
			</button>
			<button
				on:click={saveAllChanges}
				class="btn-primary"
				disabled={saving || modifiedCount === 0}
			>
				{saving ? 'Saving...' : `Save All Changes (${modifiedCount})`}
			</button>
		</div>
	</section>

	<!-- Spreadsheet Table -->
	<section class="spreadsheet">
		{#if loading}
			<div class="loading">Loading contacts...</div>
		{:else}
			<div class="table-container">
				<table class="contacts-table">
					<thead>
						<tr>
							<th class="col-name">Name *</th>
							<th class="col-email">Email *</th>
							<th class="col-phone">Phone</th>
							<th class="col-notes">Notes</th>
							<th class="col-actions">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each editingContacts as contact, index}
							<tr
								class="contact-row"
								class:new-row={contact.isNew}
								class:modified-row={contact.isModified}
							>
								<td class="col-name">
									<input
										bind:value={contact.name}
										on:input={() => markAsModified(index)}
										placeholder="Enter name..."
										class="cell-input"
										class:required={!contact.name.trim()}
									/>
								</td>
								<td class="col-email">
									<input
										bind:value={contact.email}
										on:input={() => markAsModified(index)}
										placeholder="Enter email..."
										type="email"
										class="cell-input"
										class:required={!contact.email.trim()}
									/>
								</td>
								<td class="col-phone">
									<input
										bind:value={contact.phone}
										on:input={() => markAsModified(index)}
										placeholder="Enter phone..."
										class="cell-input"
									/>
								</td>
								<td class="col-notes">
									<textarea
										bind:value={contact.notes}
										on:input={() => markAsModified(index)}
										placeholder="Enter notes..."
										class="cell-textarea"
										rows="2"
									></textarea>
								</td>
								<td class="col-actions">
									<button
										on:click={() => deleteContact(contact, index)}
										class="btn-delete-small"
										title={contact.isNew ? 'Remove row' : 'Delete contact'}
									>
										{contact.isNew ? '✕' : '🗑'}
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>

	<!-- Help Section -->
	<section class="help-section">
		<h3>💡 How to use:</h3>
		<ul>
			<li><strong>Name</strong> and <strong>Email</strong> are required fields</li>
			<li>Modified rows will be highlighted in <span class="highlight-blue">blue</span></li>
			<li>New rows will be highlighted in <span class="highlight-green">green</span></li>
			<li>Click "Save All Changes" to batch save all modifications</li>
			<li>Use "Add Row" to get an additional empty row for new contacts</li>
		</ul>
	</section>
</div>
