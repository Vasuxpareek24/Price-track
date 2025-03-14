const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Price Tracker API is running!");
});

// Example Route (Amazon Price Scraper)
app.get("/amazon-price", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Amazon Product URL required!" });

    try {
        const { data } = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
        const $ = cheerio.load(data);
        const price = $("#priceblock_ourprice, #priceblock_dealprice").text().trim();
        res.json({ price: price || "Price not found" });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch price" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
