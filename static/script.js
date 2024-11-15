document.getElementById("toggleButton").addEventListener("click", function() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("collapsed");
    this.innerHTML = sidebar.classList.contains("collapsed") ? "❯" : "❮";
});

function showLoading() {
    document.getElementById("loadingOverlay").style.display = "flex";
}

function hideLoading() {
    document.getElementById("loadingOverlay").style.display = "none";
}

document.getElementById("searchButton").addEventListener("click", function () {
    noResultsMessage.style.display = "none";
    showLoading();
    const form = document.getElementById("searchForm");
    const formData = new FormData(form);

    fetch("/search", {
        method: "POST",
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            const tableBody = document.querySelector("#resultsTable tbody");
            tableBody.innerHTML = ""; // Clear existing rows

            // Populate table with new results
            // If no results are returned, show the "No Results" message
            if (data.length === 0) {
                noResultsMessage.style.display = "block";
            } else {
                data.forEach((result) => {
                    const row = document.createElement("tr");

                    // Determine the Outcome display value
                    let outcomeDisplay;
                    if (result.Outcome.toLowerCase() === "success") {
                        outcomeDisplay = "✅";
                    } else if (result.Outcome.toLowerCase() === "failure") {
                        outcomeDisplay = "❌";
                    } else {
                        outcomeDisplay = result.Outcome; // Fallback for other cases
                    }

                    // Create the row
                    row.innerHTML = `
                        <td class="nvr-td">${result.NVR}</td>
                        <td>${outcomeDisplay}</td>
                        <td>${result["Assembly"]}</td>
                        <td>${result["Group"]}</td>
                        <td>${result["Completed"]}</td>
                        <td><a href="${result["Pipeline URL"]}" target="_blank">Pipeline URL</a></td>
                        <td><a href="${result["ART job URL"]}" target="_blank">ART Job URL</a></td>
                    `;
                    tableBody.appendChild(row);
                });
            }

            hideLoading();
        })
        .catch((error) => {
            console.error("Error:", error);
        });
});

document.addEventListener("DOMContentLoaded", () => {
    const versionDropdown = document.getElementById("group");

    // Ensure the loading overlay is hidden initially
    hideLoading();

    // Fetch the versions from the server
    fetch("/get_versions")
        .then((response) => response.json())
        .then((versions) => {
            // Clear the dropdown
            versionDropdown.innerHTML = "";

            // Populate the dropdown with fetched options
            versions.forEach((version) => {
                const option = document.createElement("option");
                option.value = version;
                option.textContent = version;
                versionDropdown.appendChild(option);
            });
        })
        .catch((error) => console.error("Error fetching versions:", error));
});

document.getElementById("clearButton").addEventListener("click", function () {
    // Reset all form fields to their default values
    const form = document.getElementById("searchForm");
    form.reset();

    document.getElementById("outcome").value = ""; // Set default value for Outcome dropdown
    document.getElementById("group").value = ""; // Clear version input field
    document.getElementById("name").value = ""; // Clear version input field
    document.getElementById("assembly").value = ""; // Reset to default Assembly value
});
