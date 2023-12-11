// content.js

// Fonction principale appelée lors du chargement de la page
window.addEventListener("load", function () {
	observeTableContent();
});

// Observer le contenu de la table dans le corps du document
function observeTableContent() {
	const tableObserver = new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {
			if (mutation.addedNodes.length > 0) {
				// Une fois que le contenu de la table est ajouté, observer les liens
				observeLinks();
				// Arrêter l'observation pour éviter les doublons
				tableObserver.disconnect();
			}
		});
	});
	tableObserver.observe(document.body, { childList: true, subtree: true });
}

// Observer les liens dans le corps du document
function observeLinks() {
	const observer = new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {
			mutation.addedNodes.forEach(function (addedNode) {
				// Vérifier si le nœud ajouté est un lien
				if (
					addedNode.nodeType === 1 &&
					addedNode.tagName.toLowerCase() === "a"
				) {
					// Traiter le clic sur le lien
					handleLinkClick(addedNode);
				}
			});
		});
	});

	// Démarrez l'observation des mutations pour le corps entier du document
	observer.observe(document.body, { childList: true, subtree: true });

	// Traitez également les liens existants lors de l'initialisation
	const allLinks = document.querySelectorAll(".q-tabs__content a");
	allLinks.forEach((existingLink) => {
		existingLink.addEventListener("click", function (event) {
			event.preventDefault();
			handleLinkClick(existingLink);
		});
	});
}

// Variable pour suivre l'état de la colonne ajoutée
let isColumnAdded = false;
let count = 0;

// Gérer le clic sur un lien
function handleLinkClick(link) {
	// Vérifiez si le lien est "#/http"
	const hrefValue = link.getAttribute("href");
	if (hrefValue === "#/http" && !isColumnAdded && count < 1) {
		count++;
		setTimeout(() => {
			// Si le lien est "#/http" et la colonne n'a pas été ajoutée, ajoutez la colonne
			const table = document.querySelector(".q-table");
			const headerRow = table.querySelector("thead tr");
			const openTh = document.createElement("th");
			openTh.textContent = "Open";
			headerRow.insertBefore(openTh, headerRow.children[3]);

			const tbodyRows = table.querySelectorAll("tbody tr");
			tbodyRows.forEach((row) => {
				// Pour chaque ligne, ajoutez le bouton "Open" et définissez son comportement
				const openTd = document.createElement("td");
				const openButton = document.createElement("button");
				openButton.classList.add(
					"q-btn",
					"inline",
					"q-btn-item",
					"non-selectable",
					"no-outline",
					"q-btn--unelevated",
					"q-btn--rectangle",
					"bg-app-toggle",
					"q-btn--actionable",
					"q-focusable",
					"q-hoverable",
					"q-btn--no-uppercase",
					"q-btn--rounded"
				);
				openButton.style.fontSize = "14px";

				const tdElement = row.querySelector(
					".q-chip__content.row.no-wrap.items-center.q-anchor--skip"
				);

				if (tdElement) {
					const tdContent = tdElement.textContent.trim();

					if (tdContent.startsWith("Host(")) {
						const match = tdContent.match(/`([^`]+)`/);
						if (match) {
							const tdLink = match[1];
							const div = document.createElement("div");
							div.style.color = "#1e54d5";
							div.textContent = "Ouvrir";

							openButton.appendChild(div);
							openButton.addEventListener("click", (event) => {
								event.stopPropagation();
								isColumnAdded = false;
								window.open(
									`https://${tdLink}`,
									"_blank",
									"noopener",
									"noreferrer"
								);
							});
							openTd.appendChild(openButton);
						}
					}
				}

				row.insertBefore(openTd, row.children[3]);
			});

			isColumnAdded = true;
		}, 1000);
	} else if (hrefValue !== "#/http" && isColumnAdded) {
		// Si le lien n'est pas "#/http" et la colonne a été ajoutée, retirez la colonne
		const table = document.querySelector(".q-table");
		const openTh = table.querySelector("thead th:nth-child(4)");
		if (openTh) {
			openTh.remove();
		}

		// Retirez également le bouton "Open" de chaque ligne
		const tbodyRows = table.querySelectorAll("tbody tr");
		tbodyRows.forEach((row) => {
			const openTd = row.querySelector("td:nth-child(4)");
			if (openTd) {
				openTd.remove();
			}
		});

		isColumnAdded = false;
	}
}

// Démarrer l'observation du contenu de la table lors du chargement initial
observeTableContent();
