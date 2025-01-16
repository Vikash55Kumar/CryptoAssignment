import { Router } from "express";
import { fetchCryptoPrices, getTargetDetails, updateCryptoTarget} from "../controller/crypto.controller.js";

const router = Router()

router.route("/updateCryptoTarget").post(updateCryptoTarget)
router.route("/getTargetDetails").get(getTargetDetails)
router.route("/crypto").get(fetchCryptoPrices)

export default router