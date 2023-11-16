const axios = require("axios");
const cheerio = require("cheerio");

const scrapebyKeyword = async (req, res, next) => {
    try {
        if (req.query.keyword) {
            const url = `https://www.amazon.com/s?k=${req.query.keyword}`;
            const result = await axios.get(url);
            const $ = cheerio.load(result.data);
            let productList = [];

            // get each product
            $('[data-component-type="s-search-result"]').each((i, product) => {
                let productData = {
                    productTitle: "",
                    ratings: 0,
                    reviews: 0,
                    image_url: "",
                    product_url: "",
                };

                // get product title
                productData.productTitle = $(product).find("h2").text().trim();

                // get product ratings
                productData.ratings = $(product)
                    .find(".a-row.a-size-small > span:first")
                    .text()
                    .trim();

                // get product reviews
                productData.reviews = $(product)
                    .find(".a-row.a-size-small > span:nth-child(2)")
                    .text()
                    .trim();

                // get product image url
                productData.image_url = $(product)
                    .find('[data-component-type="s-product-image"]')
                    .find("img")
                    .attr("src");

                // get product url
                productData.product_url =
                    "https://www.amazon.com" +
                    $(product).find("h2 > a").attr("href");

                // add product data to the list
                productList.push(productData);
            });

            // send response
            res.status(200).json({ data: productList });
        } else {
            const error = new Error("Keyword missing");
            error.status = 400;
            next(error);
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { scrapebyKeyword };
