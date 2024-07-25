const assetsContainer = document.querySelector('.content-section');
const journey = document.querySelector('.left-sidebar');
const journeyBtn = document.querySelector('.arrow');
const closeNoticebtn = document.querySelector('.close-button')
const hideNotice = document.querySelector('.notice-board')



// to remove the notice board section
closeNoticebtn.addEventListener("click",function(){
    hideNotice.classList.toggle("hide")
})


journeyBtn.addEventListener("click", function (event) {
    // Toggle classes before fetching data
    journey.classList.toggle("journey");
    journeyBtn.classList.toggle("arrowRotate");

    if (journey.classList.contains("journey")) {
        fetchDataAndUpdate();
    } else {
        // Hide the fetched data when collapsing the sidebar
        const fetchDataContainer = document.querySelector('.fetch-data-container');
        if (fetchDataContainer) {
            fetchDataContainer.classList.add("hide");
        }
    }
});

function fetchDataAndUpdate() {
    fetch("data.json")
        .then((response) => response.json())
        .then((jsonData) => {
            const data = jsonData;
            const sideNavMarkup = generateJourneyTitle(data.tasks);
            const blackSection = `
                <div class="black">
                    <h2>Journey Board</h2>
                    <img src="assets/arrow.png" id="arrow" class="arrow arrowRotate">
                </div>`;
            const fetchDataContainer = `<div class="fetch-data-container"><ul>${sideNavMarkup}</ul></div>`;
            journey.innerHTML = blackSection + fetchDataContainer;

            // Re-attach the event listener for the newly added arrow image
            const newJourneyBtn = document.querySelector('.black img.arrow');
            newJourneyBtn.addEventListener("click", function () {
                journey.classList.toggle("journey");
                newJourneyBtn.classList.toggle("arrowRotate");

                const fetchDataContainer = document.querySelector('.fetch-data-container');
                if (!journey.classList.contains("journey")) {
                    fetchDataContainer.classList.add("hide");
                } else {
                    fetchDataContainer.classList.remove("hide");
                }
            });

            // Remove the hide class to show the fetched data
            const fetchDataContainerElement = document.querySelector('.fetch-data-container');
            fetchDataContainerElement.classList.remove("hide");
        })
        .catch((error) => console.log(`Error fetching or parsing data:`, error));
}

const generateNavTitle = (asset) => {
    return `<li>${asset.asset_title}</li>`;
};

const generateJourneyTitle = (tasks) => {
    return tasks.map((task) => {
        return task.assets.map(generateNavTitle).join("");
    }).join("");
};

const generateMarkup = (asset) => {
    const markup = `
        <div class="content-card">
            <div class="thread-section">
                <h4>${asset.asset_title}</h4>
                <p><span>Description:</span>${asset.asset_description}</p>
            </div>
            <div class="image">
                ${asset.asset_content}
            </div>
        </div>
    `;
    return markup;
};

fetch("data.json")
    .then((response) => response.json())
    .then((jsonData) => {
        const data = jsonData;
        const init = function () {
            const markup = data.tasks.map((task) => 
                task.assets.map((el) => generateMarkup(el)).join("")
            ).join("");
            assetsContainer.insertAdjacentHTML('afterbegin', markup);
        };
        init();
    })
    .catch((error) => console.log(`Error fetching or parsing data:`, error));
