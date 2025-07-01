<script>
	import { onMount } from 'svelte';
	import '../app.css';
	import { PUBLIC_APPWRITE_FUNCTION_URL } from '$env/static/public';

	let contacts = $state([]);
	let editingContacts = $state([]);
	let loading = $state(false);
	let saving = $state(false);

	// Initialize with one empty row for new contacts
	function initializeEmptyRows() {
		// Ensure contacts is always an array to prevent map errors
		if (!Array.isArray(contacts)) {
			contacts = [];
		}
		
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
			const response = await fetch(`${PUBLIC_APPWRITE_FUNCTION_URL}/contacts`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			if (response.ok) {
				const data = await response.json();
				// Handle both Appwrite Function response (with documents array) and direct array
				if (data && data.documents && Array.isArray(data.documents)) {
					contacts = data.documents;
				} else if (Array.isArray(data)) {
					contacts = data;
				} else {
					console.error('Invalid response format:', data);
					contacts = [];
				}
				initializeEmptyRows();
			} else {
				console.error('Failed to load contacts');
				contacts = [];
				initializeEmptyRows();
			}
		} catch (error) {
			console.error('Error loading contacts:', error);
			contacts = [];
			initializeEmptyRows();
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

			const response = await fetch(`${PUBLIC_APPWRITE_FUNCTION_URL}/contacts`, {
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
			const response = await fetch(`${PUBLIC_APPWRITE_FUNCTION_URL}/contacts?id=${contact.$id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
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

	// Delete all contacts
	async function deleteAllContacts() {
		if (contacts.length === 0) {
			alert('No contacts to delete');
			return;
		}

		if (!confirm(`Are you sure you want to delete ALL ${contacts.length} contacts? This action cannot be undone.`)) {
			return;
		}

		saving = true;
		try {
			const response = await fetch(`${PUBLIC_APPWRITE_FUNCTION_URL}/contacts`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({}) // Empty body for delete all
			});

			if (response.ok) {
				await loadContacts();
				alert('All contacts have been deleted successfully');
			} else {
				const error = await response.json();
				alert(`Failed to delete contacts: ${error.error}`);
			}
		} catch (error) {
			console.error('Error deleting all contacts:', error);
			alert('Error deleting contacts. Please try again.');
		}
		saving = false;
	}

	// Reset all changes
	function resetChanges() {
		if (confirm('Are you sure you want to reset all unsaved changes?')) {
			initializeEmptyRows();
		}
	}

	// Count modified contacts
	let modifiedCount = $derived(editingContacts.filter(
		(c) => c.isModified || (c.isNew && (c.name.trim() || c.email.trim()))
	).length);

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
			<button onclick={addMoreRows} class="btn-secondary"> + Add Row </button>
			<button onclick={resetChanges} class="btn-cancel" disabled={modifiedCount === 0}>
				Reset Changes
			</button>
			<button
				onclick={saveAllChanges}
				class="btn-primary"
				disabled={saving || modifiedCount === 0}
			>
				{saving ? 'Saving...' : `Save All Changes (${modifiedCount})`}
			</button>
			<button
				onclick={deleteAllContacts}
				class="btn-danger"
				disabled={saving || contacts.length === 0}
			>
				{saving ? 'Deleting...' : 'Delete All'}
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
										oninput={() => markAsModified(index)}
										placeholder="Enter name..."
										class="cell-input"
										class:required={!contact.name.trim()}
									/>
								</td>
								<td class="col-email">
									<input
										bind:value={contact.email}
										oninput={() => markAsModified(index)}
										placeholder="Enter email..."
										type="email"
										class="cell-input"
										class:required={!contact.email.trim()}
									/>
								</td>
								<td class="col-phone">
									<input
										bind:value={contact.phone}
										oninput={() => markAsModified(index)}
										placeholder="Enter phone..."
										class="cell-input"
									/>
								</td>
								<td class="col-notes">
									<textarea
										bind:value={contact.notes}
										oninput={() => markAsModified(index)}
										placeholder="Enter notes..."
										class="cell-textarea"
										rows="2"
									></textarea>
								</td>
								<td class="col-actions">
									<button
										onclick={() => deleteContact(contact, index)}
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
