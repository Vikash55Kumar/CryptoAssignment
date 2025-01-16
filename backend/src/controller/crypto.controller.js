import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import axios from "axios";
import { client, io } from "../index.js";
import { Crypto } from "../model/crypto.model.js";
import { coinMetadata } from "../utility/cryptoData.js";

const updateCryptoTarget = async(req, res) => {
    const {cryptoname, target} = req.body

    console.log(cryptoname, target);
    
    if(!cryptoname | !target) {
        throw new ApiError(400, "all fields are required");
    }

    const crypto = await Crypto.findOne({cryptoname})
    if(!crypto) {
        const crypto = await Crypto.create({
            cryptoname,
            target,
        })
        if(!crypto) {
            throw new ApiError(400, "Server error by creating Crypto");
        }
        return res
        .status(200)
        .json( new ApiResponse(200, crypto, "Crypto Target update Successfully"))
        
    } else {
        console.log(crypto);
        crypto.target = target
        await crypto.save();

    return res
    .status(200)
    .json( new ApiResponse(200, "Crypto Target update Successfully"))
    }
}

const getTargetDetails = async(req, res) => {
    const target = await Crypto.find().populate();

    return res
    .status(200)
    .json( 
        new ApiResponse(200, target, "Target data fetch Successfully")
    )
}

const fetchCryptoPrices = async () => {
    const cacheKey = "crypto_prices";

    try {
        // Check cache
        const cachedData = await client.get(cacheKey);
        if (cachedData) {
            io.emit("crypto_prices", JSON.parse(cachedData)); // Broadcast cached data to all clients
            return;
        } else {

        // Fetch data from CoinGecko
        // const coingeckoResponse = await axios.get(url, {
        //     params: {
        //         vs_currency: "usd",
        //         order: "market_cap_desc",
        //         per_page: 2,
        //         page: 1,
        //     },
        // });
        // const coingeckoData = coingeckoResponse.data;
        // console.log("coin : ",coingeckoData );
        // io.emit("crypto_prices", coingeckoData); // Broadcast updated data to all clients
        // console.log("Broadcasting updated data to clients");
        
        // // Save data to cache with expiry (e.g., 10 seconds)
        // await client.set(cacheKey, JSON.stringify(coingeckoData));
        // await client.expire(cacheKey, 10);
        // }

        const response = await axios.post(process.env.CRYPTO_API, {
            currency: "USD",
                sort: "rank",
                order: "ascending",
                offset: 0,
                limit: 15,
                meta: false,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': "",
                },
            
        });
        
        const limitedData = response.data.map((coin) => {
            const metadata = coinMetadata[coin.code] || {};
            return {
                name: metadata.name || "Unknown Name", // Default if not found in metadata
                market_cap_rank: metadata.rank || "Unranked",
                image: metadata.image , // Placeholder if no image
                code: coin.code,
                date: new Date(),
                current_price: coin.rate ? coin.rate.toFixed(2) : "0.00",
                volume: coin.volume ? coin.volume.toFixed(2) : "0.00",
                market_cap: coin.cap ? coin.cap.toFixed(2) : "0.00",
            };
        });
        
        // console.log("coin : ",limitedData );
        io.emit("crypto_prices", limitedData); // Broadcast updated data to all clients
        console.log("Broadcasting updated data to clients");
        
        // Save data to cache with expiry (e.g., 10 seconds)
        await client.set(cacheKey, JSON.stringify(limitedData));
        await client.expire(cacheKey, 10);
        }

    } catch (error) {
        console.error("Error fetching cryptocurrency data:", error.message);
    }
};

// Fetch prices periodically (every 10 seconds)
setInterval(fetchCryptoPrices, 10000);

export {updateCryptoTarget, getTargetDetails, fetchCryptoPrices}
















// const fetchCryptoPrices = async (req, res) => {
//     res.setHeader("Content-Type", "text/event-stream");
//     res.setHeader("Cache-Control", "no-cache");
//     res.setHeader("Connection", "keep-alive");

//     const url = "https://api.coingecko.com/api/v3/coins/markets";
//     // const url = "http://api.coinlayer.com/live? access_key = 9e972392f1c46cbbea767b6f11c5085a"
//     const params = {
//         vs_currency: "usd", // Prices in USD
//         order: "market_cap_desc", // Order by market cap
//         per_page: 2, // Number of items per page (max 250)
//         page: 1, // Fetch the first page
//         sparkline: false, // Disable sparkline data
//         x_cg_demo_api_key: "CG-c7v3mTLjeAV2PEqMb8DfTjPD",
//     };

//     const sendCryptoPrices = async () => {
//         try {
//             const response = await axios.get(url, { params });
//             const cryptoData = response.data;

//             // Send data to the client
//             console.log("sdsd", cryptoData);
            
//             res.write(`data: ${JSON.stringify(cryptoData)}\n\n`);
//         } catch (error) {
//             console.error("Error fetching prices:", error);
//             res.write(`data: ${JSON.stringify({ error: "Failed to fetch data" })}\n\n`);
//         }
//     };

//     // Fetch prices every 10 seconds
//     const interval = setInterval(sendCryptoPrices, 100000);

//     // Cleanup when the client disconnects
//     req.on("close", () => {
//         clearInterval(interval);
//         res.end();
//     });

//     // Send initial data immediately
//     await sendCryptoPrices();
// };
