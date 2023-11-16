const searchBtn = document.getElementById("searchBtn");
const inputField = document.getElementById("inputField");
const loadingContainer = document.getElementById("loadingContainer");
const errorContainer = document.getElementById("errorContainer");

searchBtn.addEventListener("click", async () => {
    if (inputField.value.trim() != "") {
        const keyword = inputField.value.trim();
        await fetchProducts(keyword);
    } else {
        alert("Please provide a keyword");
    }
});

// function to fetch amazon product listings from the api
async function fetchProducts(keyword) {
    const url = `http://localhost:3000/api/scrape?keyword=${keyword}`;

    // reset status and data list
    errorContainer.style.display = "none";
    loadingContainer.style.display = "block";
    var container = document.getElementById("productList");
    container.innerHTML = "";

    // fetch data from api
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                errorContainer.style.display = "block";
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            const products = data.data;
            renderProducts(products, keyword);
        })
        .catch((error) => {
            console.error("Error:", error);
            loadingContainer.style.display = "none";
            errorContainer.style.display = "block";
        });
}

// Function to generate product HTML
function generateProductHTML(product) {
    var productContainer = document.createElement("div");
    productContainer.className = "product";

    var leftContainer = document.createElement("div");
    leftContainer.className = "leftCon";

    var productImage = document.createElement("div");
    productImage.className = "productImage";
    var img = document.createElement("img");
    img.src = product.image_url;
    img.alt = product.productTitle;
    productImage.appendChild(img);

    leftContainer.appendChild(productImage);

    var rightContainer = document.createElement("div");
    rightContainer.className = "rightCon";

    var productDetails = document.createElement("div");
    productDetails.className = "productDetails";

    var productTitle = document.createElement("div");
    productTitle.className = "productTitle";
    productTitle.textContent = product.productTitle;

    var productRating = document.createElement("div");
    productRating.className = "productRating";
    productRating.textContent = "Rating: " + product.ratings;

    var productReviews = document.createElement("div");
    productReviews.className = "productReviews";
    productReviews.textContent = "Reviews: " + product.reviews;

    productDetails.appendChild(productTitle);
    productDetails.appendChild(productRating);
    productDetails.appendChild(productReviews);

    var actionBtns = document.createElement("div");
    actionBtns.className = "actionBtns";

    var viewButton = document.createElement("button");
    viewButton.id = "viewBtn";
    viewButton.textContent = "View";
    viewButton.addEventListener("click", () => {
        window.open(product.product_url, "_blank");
    });

    actionBtns.appendChild(viewButton);

    rightContainer.appendChild(productDetails);
    rightContainer.appendChild(actionBtns);

    productContainer.appendChild(leftContainer);
    productContainer.appendChild(rightContainer);

    return productContainer;
}

// Function to render products
function renderProducts(products, keyword) {
    var container = document.getElementById("productList");

    var resultDetails = document.createElement("div");
    resultDetails.className = "resultDetails";
    resultDetails.textContent = `${products.length} total results for "${keyword}"`;
    container.appendChild(resultDetails);
    products.forEach(function (product) {
        var productHTML = generateProductHTML(product);
        container.appendChild(productHTML);
    });
    loadingContainer.style.display = "none";
    inputField.value = "";
}
