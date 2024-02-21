import express  from "express";
import {verifyToken} from '../middleware/jwt.js'
const router = express.Router()
import {createJournalArticle,getAllJournalArticle,getAllArticlesToVerify,postRejectionText,getSingleArticle,updateJournalArticle} from '../controllers/journalArticle.controller.js'

router.get('/',getAllJournalArticle)
router.post('/create',createJournalArticle)
router.post('/updateArticle/:articleId',updateJournalArticle)
router.get('/singleArticle/:articleId',getSingleArticle)
router.get('/verifyArticles/:profileId',verifyToken,getAllArticlesToVerify)
router.post('/verifyArticles/sendRejectionText',verifyToken,postRejectionText)


export default router